#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

#!/bin/bash

#  Possible improvements
#    During cleanup prior to start of the scripts, some error messages appear. 
#    Hide error conditions 

#  clean up containers from previous run
./clearContainers.sh  

set -ev
# generate crypto material, genesis blocks
# start Fabric network (1 Org), create and join channel, mychannel
cd ../network
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

