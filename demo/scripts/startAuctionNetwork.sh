#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

#!/bin/bash
cd $GOPATH/src/github.com/hyperledger-labs/fabric-private-chaincode/demo/scripts
./clearContainers.sh  

set -ev
# generate crypto material, genesis blocks
# start Fabric network (1 Org), create and join channel, mychannel
cd $GOPATH/src/github.com/hyperledger-labs/fabric-private-chaincode/demo/network 
./startFabric.sh 

#install and instantiate chaincode
cd ../scripts 
./installCC.sh 

# start client container
cd ../client
make run 
sleep 5 

# start frontend container
cd ../frontend
make run 
sleep 5

# test: Submit a few transactions to client
cd ../scripts 
./submitTx.sh 

