#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

#!/bin/bash

#  There are 2 installs, followed by (instantiate and upgrade)
#  with (install + instantiate) executed once, the _correct_ chaincode was not getting installed
#  when run using scripts.  It may be a delay timing issue.  Yet to figure out what the correct reason is
#  for this behaviour.  "sleep 15" has been added in an attempt to fix the above mentioned error.
#  When (install + instantiate) commands are executed by hand, it works.  With scripting, the delay 
#  due to manual action is absent.  Is that the reason?? 
#  This version works.  TODO:  To come back and identify the reason for this error

set -ev
export WAIT_TIME=15
docker exec cli peer chaincode install -n mockcc -v 1.0 --path /opt/chaincode/javascript -l NODE
sleep ${WAIT_TIME} 

docker exec cli peer chaincode instantiate -n mockcc -v 1.0  --channelID mychannel -o orderer.example.com:7050 -c '{"Args":[]}' 
sleep ${WAIT_TIME} 

docker exec cli peer chaincode install -n mockcc -v 1.1 --path /opt/chaincode/javascript  -l NODE
sleep ${WAIT_TIME} 

docker exec cli peer chaincode upgrade -n mockcc -v 1.1  --channelID mychannel -o orderer.example.com:7050 -c '{"Args":[]}' 
sleep ${WAIT_TIME} 
