#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

#!/bin/bash

set -ev
export WAIT_TIME=15
export version=1.1
#enroll CA's admin so that we can register org1's adminp
docker exec ca.example.com fabric-ca-client enroll \
    -u http://caadmin:adminpw@localhost:7054

# using CA's admin identity, register org1's admin "org1admin"
docker exec ca.example.com fabric-ca-client register \
   --id.name org1admin --id.secret adminpw  \
   --id.type admin  --id.affiliation org1  \
   --id.attrs 'hf.Registrar.Roles=user, hf.Revoker=true' \
   --id.attrs 'hf.GenCRL=true, admin=true:ecert, hf.Registrar.Attributes=approle=auction.*:ecert' \
   --id.attrs 'approle=auction.*' \
   --url http://caadmin:adminpw@localhost:7054

#verify org1admin has been registered
#........................................................
echo "List of identities registered with ca.example.com: "
docker exec ca.example.com fabric-ca-client identity list
#........................................................

# using org1's admin identity, register other users from config.json
#
#  Note: This could be done using node.js sdk.  However,
#  attribute "auction.auctioneer" and "auction.bidder" could not be added
#  from node.js code.  Could successfully register with these attributes
#  from cli.  Hence, using this approach.
#
for (( i=0; i<4; i++ ))
do
    export username=$( (jq --arg i $i '.users[$i|tonumber].userName' config.json ) | sed 's/"//g')
    export userrole=$( (jq --arg i $i '.users[$i|tonumber].userRole' config.json) | sed 's/"//g')
    echo "i = $i; username=$username;  userrole=$userrole"

    docker exec ca.example.com fabric-ca-client register \
      --id.name $username --id.secret adminpw \
      --id.type user  --id.affiliation org1 \
      --id.attrs "approle=$userrole:ecert" \
      --url http://org1admin:adminpw@localhost:7054
done
