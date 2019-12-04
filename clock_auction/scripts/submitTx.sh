#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

#!/bin/bash

set -ev


curl -H "Content-Type: application/json" -X GET  http://localhost:3000/api/getRegisteredUsers

# userName = A-Telecom;
curl -H "Content-Type: application/json" -H "authorization:A-Telecom" -X POST -d '{"tx":"createAuction","args":["unused"]}' http://localhost:3000/api/cc/invoke


curl -H "Content-Type: application/json" -H "authorization:A-Telecom" -X POST -d '{"tx":"getAuctionDetails","args":["unused"]}' http://localhost:3000/api/cc/invoke


curl -H "Content-Type: application/json" -H "authorization:A-Telecom" -X POST -d '{"tx":"getAuctionStatus","args":["unused"]}' http://localhost:3000/api/cc/invoke


curl -H "Content-Type: application/json" -H "authorization:A-Telecom" -X POST -d '{"tx":"startNextRound","args":["unused"]}' http://localhost:3000/api/cc/invoke


curl -H "Content-Type: application/json" -H "authorization:A-Telecom" -X POST -d '{"tx":"endRound","args":["unused"]}' http://localhost:3000/api/cc/invoke

curl -H "Content-Type: application/json" -H "authorization:A-Telecom" -X POST -d '{"tx":"submitInitialClockBid","args":["unused"]}' http://localhost:3000/api/cc/invoke

#  userName = B-Net;
curl -H "Content-Type: application/json" -H "authorization:B-Net" -X POST -d '{"tx":"submitRegularClockBid","args":["unused"]}' http://localhost:3000/api/cc/invoke


curl -H "Content-Type: application/json" -H "authorization:B-Net" -X POST -d '{"tx":"getRoundInfo","args":["unused"]}' http://localhost:3000/api/cc/invoke


curl -H "Content-Type: application/json" -H "authorization:B-Net" -X POST -d '{"tx":"getBidderRoundResults","args":["unused"]}' http://localhost:3000/api/cc/invoke


curl -H "Content-Type: application/json" -H "authorization:B-Net" -X POST -d '{"tx":"getOwnerRoundResults","args":["unused"]}' http://localhost:3000/api/cc/invoke


curl -H "Content-Type: application/json" -H "authorization:B-Net" -X POST -d '{"tx":"submitAssignBid","args":["unused"]}' http://localhost:3000/api/cc/invoke



curl -H "Content-Type: application/json" -H "authorization:B-Net" -X POST -d '{"tx":"getAssignmentResults","args":["unused"]}' http://localhost:3000/api/cc/invoke


#............  Queries  ..............

# userName = "C-Mobile"
curl -H "Content-Type: application/json" -H "authorization:C-Mobile" -X POST -d '{"tx":"createAuction","args":["unused"]}' http://localhost:3000/api/cc/query


curl -H "Content-Type: application/json" -H "authorization:C-Mobile" -X POST -d '{"tx":"getAuctionDetails","args":["unused"]}' http://localhost:3000/api/cc/query


curl -H "Content-Type: application/json" -H "authorization:C-Mobile" -X POST -d '{"tx":"getAuctionStatus","args":["unused"]}' http://localhost:3000/api/cc/query


curl -H "Content-Type: application/json" -H "authorization:C-Mobile" -X POST -d '{"tx":"startNextRound","args":["unused"]}' http://localhost:3000/api/cc/query

curl -H "Content-Type: application/json" -H "authorization:C-Mobile" -X POST -d '{"tx":"endRound","args":["unused"]}' http://localhost:3000/api/cc/query


curl -H "Content-Type: application/json" -H "authorization:C-Mobile" -X POST -d '{"tx":"submitInitialClockBid","args":["unused"]}' http://localhost:3000/api/cc/query


#  "userName": "Auctioneer1"
curl -H "Content-Type: application/json" -H "authorization:Auctioneer1" -X POST -d '{"tx":"submitRegularClockBid","args":["unused"]}' http://localhost:3000/api/cc/query


curl -H "Content-Type: application/json" -H "authorization:Auctioneer1" -X POST -d '{"tx":"getRoundInfo","args":["unused"]}' http://localhost:3000/api/cc/query


curl -H "Content-Type: application/json" -H "authorization:Auctioneer1" -X POST -d '{"tx":"getBidderRoundResults","args":["unused"]}' http://localhost:3000/api/cc/query



curl -H "Content-Type: application/json" -H "authorization:Auctioneer1" -X POST -d '{"tx":"getOwnerRoundResults","args":["unused"]}' http://localhost:3000/api/cc/query



curl -H "Content-Type: application/json" -H "authorization:Auctioneer1" -X POST -d '{"tx":"submitAssignBid","args":["unused"]}' http://localhost:3000/api/cc/query


curl -H "Content-Type: application/json" -H "authorization:Auctioneer1" -X POST -d '{"tx":"getAssignmentResults","args":["unused"]}' http://localhost:3000/api/cc/query
