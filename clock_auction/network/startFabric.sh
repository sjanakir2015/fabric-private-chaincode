#!/bin/sh
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
export PATH=${PWD}/bin:${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
export CHANNEL_NAME=mychannel
export COMPOSE_PROJECT_NAME=fabric

# remove previous crypto material and config transactions
rm -fr config/*
rm -fr crypto-config/*
mkdir config

# generate crypto material
cryptogen generate --config=./crypto-config.yaml
if [ "$?" -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi

# copy admin key files to adminKey.pem for ease of use
cp crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/*sk crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/adminKey.pem
cp crypto-config/peerOrganizations/org1.example.com/ca/*sk crypto-config/peerOrganizations/org1.example.com/ca/ca-keyfile.pem

# generate genesis block for orderer
configtxgen --configPath . -profile OneOrgOrdererGenesis -outputBlock ./config/genesis.block
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi

# generate channel configuration transaction
configtxgen -profile Org1Channel -outputCreateChannelTx ./config/${CHANNEL_NAME}.tx -channelID ${CHANNEL_NAME}
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi

# generate anchor peer transaction
configtxgen -profile Org1Channel -outputAnchorPeersUpdate ./config/Org1MSPanchors.tx -channelID ${CHANNEL_NAME} -asOrg Org1MSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Org1MSP..."
  exit 1
fi

sleep 5s

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

# Assumed that containers not defined in docker-compose.yaml are already killed
# before this script was started
set +e
docker-compose -f docker-compose.yaml down
if [ $? -gt 0 ]
    then
     echo "    "
     echo "Make sure all containers in docker-network, fabric_basic have been deleted."
     echo "Use Command:  docker container kill client frontend"
     exit 1
    fi

set -e
docker container list
docker container prune -f
docker-compose -f docker-compose.yaml up -d orderer.example.com peer0.org1.example.com cli ca.example.com
docker container list

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Create the channel, CHANNEL_NAME
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel create -o orderer.example.com:7050 -c ${CHANNEL_NAME} -f /etc/hyperledger/configtx/${CHANNEL_NAME}.tx

# Join peer0.org1.example.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel join -b ${CHANNEL_NAME}.block
