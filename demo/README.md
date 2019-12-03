
### Goal: Bring up Fabric Auction network for demo

## Prequisites
It is assumed that
- the repository is cloned in FPC-INSTALL-DIR which is ${GOPATH}/src/github.com/hyperledger-labs/fabric-private-chaincode
Although FPC is not used, the path is used in some scripts.  (This could possibly removed in later versions)

Usage:
```
git clone git@github.com:sjanakir2015/fabric-private-chaincode.git
cd fabric-private-chaincode
git checkout mockcc
```

## Build images once
```
cd <FPC-INSTALL-DIR>/clock_auction/client/backend
make build
cd ../frontend
make build
```

## Bring up network
```
cd <FPC-INSTALL-DIR>/clock_auction/scripts
./startAuctionNetwork.sh
```

## Test

```
cd <FPC-INSTALL-DIR>/clock_auction/scripts
./submitTx.sh
```

If you see json responses for the curl commands, then connectivity to client and chaincode is verified.  

## Other utility scripts

To upgrade a chaincode:
```
cd <FPC-INSTALL-DIR>/clock_auction/scripts
./upgradeCC.sh  2.0
./upgradeCC.sh workingversion
```

Note:  Add the following lines to .gitignore file:
```
**/node_modules/*
**/wallet/*
**/config/*
**/crypto-config/*
```

## Backend apis

Get the list of registered users.  No authentication is in place for this api.
```http://localhost:3000/api/getRegisteredUsers
```

Use one of the following functions to invoke a transaction or query.  Please note that any chaincode function can be called using invoke or query.   The api expects the following header:  `{x-user:username}` where `username` is an entry in the list from `getRegisteredUsers`.
```
http://localhost:3000/api/cc/invoke
http://localhost:3000/api/cc/query
```
