#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

#!/bin/bash
set +v
nLines=3
function printBlankLines ()
{
#for i in { 1 .. $nLines }   
for (( i=1; i<=5; i++ ))
do
  echo " "
done
}

set -v
curl -H "Content-Type: application/json" -X POST -d '{"tx":"createAuction","args":["unused"]}' http://localhost:3000/cc/submit
nLines=12; printBlankLines  # print 12 blank lines 

curl -H "Content-Type: application/json" -X POST -d '{"tx":"getAuctionDetails","args":["unused"]}' http://localhost:3000/cc/submit
nLines=12; printBlankLines  # print 12 blank lines 

curl -H "Content-Type: application/json" -X POST -d '{"tx":"getAuctionStatus","args":["unused"]}' http://localhost:3000/cc/submit
nLines=12; printBlankLines  # print 12 blank lines 
