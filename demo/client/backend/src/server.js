/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/

'use strict';

//const { Gateway, Client, FileSystemWallet, X509WalletMixin } = require('fabric-network');
//const fs = require('fs');
//const path = require('path');
const fabricClient = require('./fabricClient');
const ccRoute = require('./ccRoute');
const apiRoute = require('./apiRoute');

// const auctionRoute = require('./auctionRoute');


////////////////////////////  Global constants  /////////////////
//  errorcodes
const SUCCESS = 0;
const FAILURE  = 1;

//  SJ: install express
var express = require('express');
var app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    next();
});


app.get('/',(function(req,res){
    res.send('Welcome to Spectrum Auction by Elbonia Communication Commission - Enabled by FPC');
}));

//  route for cc
app.use('/api/cc', ccRoute);
app.use('/api', apiRoute);

//  route for /auction  //  mock data
// app.use('/auction', auctionRoute);

async function main() {
    console.log ("Listening on localhost:3000...");
    var server=app.listen(3000,function() {});

    //await fabricClient.addIdentityToWallet();
     await fabricClient.connectToNetwork ("mychannel", "mockcc");

    //  test connection for sacc
    //  await fabricClient.submitTransaction("set", "key1", "899") ;
    //  test connection for mockcc
    //await fabricClient.submitTransaction("createAuction", "101") ;
}


main();

  // curl -H "Content-Type: application/json" -X POST -d '{"tx":"createAuction","args":["90"]}' http://localhost:3000/cc/submit
  // curl -H "Content-Type: application/json" -X POST -d '{"tx":"createAuction","args":["90"]}' http://localhost:3000/cc/submit
  // curl -H "Content-Type: application/json" -X POST -d '{"tx":"createAuction","args":["90"]}' http://localhost:3000/cc/submit
  // curl -H "Content-Type: application/json" -X POST -d '{"tx":"createAuction","args":["90"]}' http://localhost:3000/cc/submit
