/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/

const express = require('express');
//const fabricClient = require('./fabricClient');
const fs = require('fs');
//const path = require('path');
const clockauctionRouter = express.Router();

////////////////////////////  Global constants  /////////////////
//  errorcodes
const SUCCESS = 0;
const FAILURE  = 1;
const USER_EXISTS = 2;
const USER_UNAUTHORIZED = 3;


clockauctionRouter.route('/getDefaultAuction').get (function (request, response) {
    console.log('>>>  Entry:  clockauctionRouter.getDefaultAuction');

    //  read auction.json and return in response
    result = JSON.parse(fs.readFileSync('auction.json', 'utf8'));
    console.log (result);
    response.json (result);
});


module.exports = clockauctionRouter;
