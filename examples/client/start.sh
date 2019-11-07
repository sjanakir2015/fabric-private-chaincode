#!/bin/sh
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
export FABRIC_LOCATION=${PWD}/../../../../hyperledger/fabric
export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/../bin:$FABRIC_LOCATION/.build/bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
export CHANNEL_NAME=auctionchannel

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

# generate genesis block for orderer
configtxgen --configPath . -profile FourOrgOrdererGenesis -outputBlock ./config/genesis.block
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi

# generate channel configuration transaction
configtxgen -profile OrgFourChannel -outputCreateChannelTx ./config/${CHANNEL_NAME}.tx -channelID ${CHANNEL_NAME}
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi

# generate anchor peer transaction
configtxgen -profile OrgFourChannel -outputAnchorPeersUpdate ./config/Org1MSPanchors.tx -channelID ${CHANNEL_NAME} -asOrg Org1MSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Org1MSP..."
  exit 1
fi

sleep 5s

set -ev

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

docker-compose -f docker-compose.yml down

docker-compose -f docker-compose.yml up -d   orderer.example.com peer0.org1.example.com peer0.org2.example.com peer0.org3.example.com peer0.org4.example.com cli

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
#  original value for timeout=10
export FABRIC_START_TIMEOUT=15
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Create the channel, CHANNEL_NAME
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel create -o orderer.example.com:7050 -c ${CHANNEL_NAME} -f /etc/hyperledger/configtx/${CHANNEL_NAME}.tx

# Join peer0.org1.example.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel join -b ${CHANNEL_NAME}.block

# Now, for org2
# fetch the channel block 
docker exec -e "CHANNEL_NAME=auctionchannel" -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org2.example.com/msp" peer0.org2.example.com peer channel fetch oldest ${CHANNEL_NAME}.block -o orderer.example.com:7050  --channelID ${CHANNEL_NAME}

# Join peer0.org2.example.com to the channel.
docker exec -e "CHANNEL_NAME=auctionchannel" -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org2.example.com/msp" peer0.org2.example.com peer channel join -b ${CHANNEL_NAME}.block

# check if peer0.org2.example.com joined the channel 
docker exec -e "CHANNEL_NAME=auctionchannel" -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org2.example.com/msp" peer0.org2.example.com peer channel list 

# Now, for org3
# fetch the channel block 
docker exec -e "CHANNEL_NAME=auctionchannel" -e "CORE_PEER_LOCALMSPID=Org3MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org3.example.com/msp" peer0.org3.example.com peer channel fetch oldest auctionchannel.block -o orderer.example.com:7050  --channelID auctionchannel

# Join peer0.org3.example.com to the channel.
docker exec -e "CHANNEL_NAME=auctionchannel" -e "CORE_PEER_LOCALMSPID=Org3MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org3.example.com/msp" peer0.org3.example.com peer channel join -b auctionchannel.block

# check if peer0.org3.example.com joined the channel 
docker exec  -e "CORE_PEER_LOCALMSPID=Org3MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org3.example.com/msp" peer0.org3.example.com peer channel list 

# Now, for org4
# fetch the channel block 
docker exec -e "CHANNEL_NAME=auctionchannel" -e "CORE_PEER_LOCALMSPID=Org4MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org4.example.com/msp" peer0.org4.example.com peer channel fetch oldest auctionchannel.block -o orderer.example.com:7050  --channelID auctionchannel

# Join peer0.org4.example.com to the channel.
docker exec -e "CHANNEL_NAME=auctionchannel" -e "CORE_PEER_LOCALMSPID=Org4MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org4.example.com/msp" peer0.org4.example.com peer channel join -b auctionchannel.block

# check if peer0.org4.example.com joined the channel 
docker exec  -e "CORE_PEER_LOCALMSPID=Org4MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org4.example.com/msp" peer0.org4.example.com peer channel list 

# Exec into peer0.org1.example.com container 
#docker exec -it -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com bash 

# Exec into peer0.org2.example.com container 
#docker exec -it -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org2.example.com/msp" peer0.org2.example.com bash 

# Exec into peer0.org3.example.com container 
#docker exec -it -e "CORE_PEER_LOCALMSPID=Org3MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org3.example.com/msp" peer0.org3.example.com bash 

# Exec into peer0.org4.example.com container 
#docker exec -it -e "CORE_PEER_LOCALMSPID=Org4MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org4.example.com/msp" peer0.org4.example.com bash 

