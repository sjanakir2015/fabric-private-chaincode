/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/

// ccRouter.js

const express = require('express');
const fabricClient = require('./fabricClient');
const ChaincodeRouter = express.Router();

////////////////////////////  Global constants  /////////////////
//  errorcodes
const SUCCESS = 0;
const FAILURE  = 1;
const USER_EXISTS = 2;
const USER_UNAUTHORIZED = 3;


ChaincodeRouter.route('/invoke').post(function (request, response) {
  console.log ("----------------------------------------------------------");
  console.log ("In route api/cc/invoke:  request.body = ", request.body);

  const tx = request.body.tx;
  const args = request.body.args;

  //  get userName from "Authorization" header
  //  decode from base64
  var userName = ( request.headers['x-user']);

  //  decode it
  //userName  = Buffer.from(userName, 'base64').toString('utf-8');
  userName = userName.trim();
  console.log ('...........................');
  console.log ('userName from header = ', userName.trim());
  console.log ('...........................');

  //  Insert transaction name, userName at index 1,0 in args array
  args.unshift(tx);
  args.unshift (userName);

  fabricClient.invoke.apply ("unused", args)
  .then(function (result)  {
    response.json (result);
  })
  .catch(error => {
    //  if enrollUser failed then send 401 Unauthorized
    if (error.status.rc == USER_UNAUTHORIZED) {
      response.status(401).send(error);
    }
    else {
    console.error("In ccRoute.js: route invoke:  error = ", error);
    response.status(500).send(error);
    }
  });
});


ChaincodeRouter.route('/query').post(function (request, response) {
  console.log ("----------------------------------------------------------");
  console.log ("In route api/cc/invoke:  request.body = ", request.body);

  const tx = request.body.tx;
  const args = request.body.args;

  //  get userName from "Authorization" header
  //  decode from base64
  var userName = ( request.headers['x-user']);

  //  decode it
  //userName  = Buffer.from(userName, 'base64').toString('utf-8');
  userName = userName.trim();
  console.log ('...........................');
  console.log ('userName from header = ', userName.trim());
  console.log ('...........................');

    //  Insert transaction name, userName at index 1,0 in args array
   args.unshift(tx);
   args.unshift (userName);

  fabricClient.query.apply ("unused", args)
  .then(function (result)  {
    response.json (result);
  })
  .catch(err => {
    //  if enrollUser failed then send 401 Unauthorized
    if (error.status.rc == USER_UNAUTHORIZED) {
      response.status(401).send(error);
    }

    console.error("In ccRoute.js: route invoke:  error = ", error);
    response.status(500).send(error);
  });

});

module.exports = ChaincodeRouter;
