/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/

// ccRouter.js

const express = require('express');
const fabricClient = require('./fabricClient');
const ChaincodeRouter = express.Router();


ChaincodeRouter.route('/submit').post(function (request, response) {
  console.log ("In route /cc/submit:  request.body = ", request.body);

  /*
    //  Format result as per chaincode interface
    //  submit submitTransaction
    //  Format result from chaincode; return response
  */

  const tx = request.body.tx;
  const args = request.body.args;
  //  Insert transaction name at index 0 in args array
  args.unshift(tx);

  fabricClient.submitTransaction.apply ("unused", args)
  .then(function (result)  {
    response.json (result);
  })
  .catch(err => {
    response.status(400).send(err);
  });
});

module.exports = ChaincodeRouter;
