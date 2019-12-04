#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0


#  There are 2 installs, followed by (instantiate and upgrade)
#  with (install + instantiate) executed once, the _correct_ chaincode was not getting installed
#  when run using scripts.  It may be a delay timing issue.  Yet to figure out what the correct reason is
#  for this behaviour.  "sleep 15" has been added in an attempt to fix the above mentioned error.
#  When (install + instantiate) commands are executed by hand, it works.  With scripting, the delay 
#  due to manual action is absent.  Is that the reason?? 
#  This version works.  TODO:  To come back and identify the reason for this error
#  above comment is not valid anymore;  But this version works !  
set -ev

export WAIT_TIME=15
export version=1.1
export FABRIC_BIN_DIR=/project/src/github.com/hyperledger/fabric/.build/bin
export PEER_CMD=/project/src/github.com/hyperledger-labs/fabric-private-chaincode/fabric/bin/peer.sh
export FPC_DIR=/project/src/github.com/hyperledger-labs/fabric-private-chaincode

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com ${PEER_CMD} chaincode install -n mockcc -v nov-1129 --path ${FPC_DIR}/demo/chaincode/javascript  -l NODE
sleep ${WAIT_TIME} 

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" -e "ORDERER_ADDR=orderer.example.com:7050" peer0.org1.example.com ${PEER_CMD} chaincode instantiate -n mockcc -v nov-1129 --channelID mychannel -o orderer.example.com:7050 -c '{"Args":[]}'
sleep ${WAIT_TIME} 



