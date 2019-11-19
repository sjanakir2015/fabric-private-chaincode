#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

#!/bin/bash

#  set -ev
if [ $# -lt 1 ] 
then 
    echo "Expected 1 argument; Usage:  upgradeiCC.sh version#"
else 
  docker exec cli peer chaincode install -n mockcc -v ${1} --path /opt/chaincode/javascript  -l NODE
  echo "Wait for 15 seconds ... " 
  sleep 15
  docker exec cli peer chaincode upgrade -n mockcc -v ${1}  --channelID mychannel -o orderer.example.com:7050 -c '{"Args":[]}' 
fi

