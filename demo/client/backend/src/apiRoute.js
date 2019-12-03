/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/

const express = require('express');
const fabricClient = require('./fabricClient');
const ApiRouter = express.Router();

////////////////////////////  Global constants  /////////////////
//  errorcodes
const SUCCESS = 0;
const FAILURE  = 1;
const USER_EXISTS = 2;
const USER_UNAUTHORIZED = 3;

/*
login():  Password is hardcoded (to emphasize that this is not production code)
If the pair is a valid pair (according to config / CA), login is successful.
Assumption is that only those users who are authorized to use this application
has access - since this is being developed for a demo.  In a production system,
there is a need for a controlled access to the application, for example, by OAuth

input:  userName, userRole
output:  status json
status.rc:  SUCCESS, USER_NOT_ENROLLED, TRANSACTION_ERROR
status.msg:  corresponding error msg
*/
ApiRouter.route('/login').post(function (request, response) {
    //  console.log ("In route /api/login:  request.body = ", request.body);
    console.log (">>>  In route /api/login:  ");
    const userName  = request.body.userName;
    const userRole = request.body.userRole;
    const secret   = "adminpw";  //  need to be passed from UI?

    //  Todo:  add this:  check if user credentials exist in the wallet
    //  if not, enroll with Certificate Authority;
    //  if successful, return success; else error.

    console.log('>>>  Entry:  apiRoute.login');

    fabricClient.enrollUser(userName, secret, userRole).then((result) => {
        fabricClient.setUserContext(userName,"unused pwd")
            .then ( (result) => {
                console.log('response from fabricClient.setUserContext:  ',result);
                response.send(result);
            },(error) => {
                console.log('Error returned from fabricClient.setUserContext:  ',error);
                response.send(error);
            } );  //  end of call to setUserContext
    }, (error) => {
          console.log('Error returned function enrollUser:  ',error);
          response.send(error);
    } );    //  end of call to enrollUser
  });


ApiRouter.route('/getRegisteredUsers').get (function (request, response) {
    console.log('>>>  Entry:  apiRoute.getRegisteredUsers');
    fabricClient.getRegisteredUsers().then((result) => {
        // process response
        console.log('Process getAllUsers response');
        response.send(result);
        },(error) => {
            error.errorCode = 0;
            console.log('Error returned function getAllUsers:  ',error);
            response.send(error);
        });

});


module.exports = ApiRouter;
