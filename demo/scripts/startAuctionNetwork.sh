#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0

export DEMO_SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
export FPC_ROOT=${DEMO_SCRIPTS_DIR}/../..
export NETWORK_DIR=${FPC_ROOT}/utils/docker-compose/
export CONTAINER_FPC=/project/src/github.com/hyperledger-labs/fabric-private-chaincode

#  Possible improvements
#    During cleanup prior to start of the scripts, some error messages appear. 
#    Hide error conditions 

set -ev
# generate crypto material, genesis blocks
# start Fabric network (1 Org), create and join channel, mychannel
${NETWORK_DIR}/scripts/generate.sh
${NETWORK_DIR}/scripts/start.sh

#install and instantiate chaincode
${DEMO_SCRIPTS_DIR}/installCC.sh 

# start client container
# cd ../client
# make run 
# sleep 5 

# # start frontend container
# cd ../frontend
# make run 
# sleep 5

# # test: Submit a few transactions to client
# cd ../scripts 
# ./submitTx.sh 

