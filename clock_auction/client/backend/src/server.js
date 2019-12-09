/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const fabricClient = require('./fabricClient');
const ccRoute = require('./ccRoute');
const apiRoute = require('./apiRoute');
const clockauctionRoute = require('./clockauctionRoute');

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

//  different routes defined
app.use('/api/cc', ccRoute);
app.use('/api', apiRoute);
app.use('/api/clock_auction', clockauctionRoute);

async function main() {
    console.log ("Listening on localhost:3000...");
    var server=app.listen(3000,function() {});

    await fabricClient.connectToNetwork ("mychannel", "mockcc");
}


main();
