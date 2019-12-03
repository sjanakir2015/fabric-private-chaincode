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
#  above comment is not valid anymore;  But this version works !  
set -ev
export WAIT_TIME=15
export version=1.1

docker image prune -f
docker exec cli peer chaincode install -n mockcc -v ${version} --path /opt/chaincode/javascript  -l NODE
sleep ${WAIT_TIME} 

docker exec cli peer chaincode instantiate -n mockcc -v ${version}  --channelID mychannel -o orderer.example.com:7050 -c '{"Args":[]}' 
sleep ${WAIT_TIME} 
