#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

#!/bin/bash

set -ev
curl -H "Content-Type: application/json" -X POST -d '{"tx":"createAuction","args":["unused"]}' http://localhost:3000/cc/submit
echo "   "; echo "   "
curl -H "Content-Type: application/json" -X POST -d '{"tx":"getAuctionDetails","args":["unused"]}' http://localhost:3000/cc/submit
echo "   "; echo "   "
curl -H "Content-Type: application/json" -X POST -d '{"tx":"getAuctionStatus","args":["unused"]}' http://localhost:3000/cc/submit
echo "   "; echo "   "

curl -H "Content-Type: application/json" -X POST -d '{"tx":"startNextRound","args":["unused"]}' http://localhost:3000/cc/submit
echo "   "; echo "   "
curl -H "Content-Type: application/json" -X POST -d '{"tx":"endRound","args":["unused"]}' http://localhost:3000/cc/submit
echo "   "; echo "   "

curl -H "Content-Type: application/json" -X POST -d '{"tx":"submitInitialClockBid","args":["unused"]}' http://localhost:3000/cc/submit
echo "   "; echo "   "
curl -H "Content-Type: application/json" -X POST -d '{"tx":"submitRegularClockBid","args":["unused"]}' http://localhost:3000/cc/submit
echo "   "; echo "   "

curl -H "Content-Type: application/json" -X POST -d '{"tx":"getRoundInfo","args":["unused"]}' http://localhost:3000/cc/submit
echo "   "; echo "   "
curl -H "Content-Type: application/json" -X POST -d '{"tx":"getBidderRoundResults","args":["unused"]}' http://localhost:3000/cc/submit
echo "   "; echo "   "
curl -H "Content-Type: application/json" -X POST -d '{"tx":"getOwnerRoundResults","args":["unused"]}' http://localhost:3000/cc/submit
echo "   "; echo "   "
curl -H "Content-Type: application/json" -X POST -d '{"tx":"submitAssignBid","args":["unused"]}' http://localhost:3000/cc/submit
echo "   "; echo "   "
curl -H "Content-Type: application/json" -X POST -d '{"tx":"getAssignmentResults","args":["unused"]}' http://localhost:3000/cc/submit
echo "   "; echo "   "



