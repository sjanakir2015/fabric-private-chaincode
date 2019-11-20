/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/

// ccRouter.js

const express = require('express');
const fabricClient = require('./fabricClient');
const ApiRouter = express.Router();

/*
login()
input:  userName, userRole
output:  user, approle
response.errorcode:  SUCCESS, USER_NOT_ENROLLED, TRANSACTION_ERROR
response.errormessage:  will have text for error message (edited)
*/
ApiRouter.route('/login').post(function (request, response) {
  console.log ("In route /api/login:  request.body = ", request.body);
  // console.log (">>>  In route /api/login:  ");
  const userName  = request.body.userName;
  const userRole = request.body.userRole;

  if  ( ( (userName == "user4") && (userRole == "auctioneer") )  ||

        (((userName == "user3") || (userName == "user2") || (userName == "user1") )  &&
         (userRole == "bidder"))
     )
  {
    var result =
    {
      "status": {  'rc': 0,  'msg': 'success'}
    };
  }
  else {
    var result =
    {
      "status": {  'rc': 1,  'msg': 'userName or userRole is not found;'}
    };
  }
    /*var result =
  {
    "status": {  'rc': 1,  'msg': 'Username or userrole is not found;  what else do you want?'},
    "approle" : ""
  }; */

    console.log ('result = ', result);
    response.send(JSON.stringify (result));
  });

/*
    let userid = req.query.userName;
    fabricClient.setUserContext (userid, password)
    .then ((result) => {
        console.log('>>> GET login() ... userid = ' + userid);
        fabricClient.submitTransaction('Tx_GetUserRole', '').then((userRole) => {
            console.log ("Successfully submitted Tx_GetUserRole:" + userRole);
            var result = {};
            result.errorcode = SUCCESS;   //  SUCCESS = 0
            result.errormessage = "User is enrolled and has an approle" + userRole;
            var tmp = userRole.toString();
            result.approle = tmp.substring(1,tmp.length-1);
            res.send(result);
        }, (error) => {  //  error in transaction submission
            console.log ("ERROR in Tx_GetUserRole:" + ejrror);
            var result = {};
            result.errorcode = TRANSACTION_ERROR;
            result.errormessage = "Error while invoking transaction in smart contract";
            result.approle = "";
            res.send(result);
        });
     }, (error) => {  //  not registered or enrolled
        var result ={};
        console.log ("ERROR in setUserContext:" + error);
        result.errorcode = USER_NOT_ENROLLED;
        result.errormessage = "User is not registered or enrolled. \n" + error;
        result.approle = "";
        res.send(result);
    });
*/

ApiRouter.route('/getallusers').get (function (request, response) {

      var result = [  {	"userid": "user1",		"approle": "bidder" },
                      {	"userid": "user2",		"approle": "bidder" },
                      {	"userid": "user3",		"approle": "bidder" },
                      {	"userid": "user4",		"approle": "auctioneer" }];
      response.send(JSON.stringify (result));
/*
    getAllUsers().then((result) => {
        // process response
        console.log('Process getAllUsers response');
        //  result.errorCode = 1;
        res.send(result);
        },(error) => {
            //  handle error if transaction failed
            error.errorCode = 0;
            console.log('Error returned function getAllUsers:  ',error);
            res.send(error);
        });

  // curl -H "Content-Type: application/json" -X POST -d '{"userName":"user1","userRole":"bidder"}' http://localhost:3000/api/login

*/
});


module.exports = ApiRouter;
