/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const FabricCAClient = require('fabric-ca-client');
const { Gateway, Client, FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

////////////////////////////  Global constants  /////////////////
//  errorcodes
const SUCCESS = 0;
const FAILURE  = 1;
const USER_EXISTS = 2;
const USER_UNAUTHORIZED = 3;

/////////////////////////////  input  //////////////////////////////////////////
const orgName        = 'Org1MSP';
const orgDomainName  = 'org1.example.com';
//const userName       = 'Admin';  //  hardcoded !
const org1Affiliation = 'org1';  //  different from MSP;  used in CA

//  affiliation is used in CA;  to add to the list of affiliation, customize
//  fabric-ca-server-config.yaml and pass in as cafiles in start command.
//  If not, use 'org1' and 'org2' - case sensitive, which is defined in
// the default  fabric-ca-server-config.yaml.

/////////////////////////////  end of input  ///////////////////////////

//  global variables loaded initially
var configdata;
var mspDir;
var connectionProfile;
var wallet;
var adminUserName;
var secret;
var bLocalHost;  //  used in setUserContext


//  other global variables
var strResponse;
var gateway;
var network;
var contract;

//  exported functions
async function connectToNetwork(channelName, chaincodeID) {
    console.log (">>> In function, connectToNetwork: channelName, chaincodeID = ", channelName, chaincodeID);

    await beginNetworkConnect();

    try {
      gateway = await new Gateway();
    }  catch (error) {
      console.log(`Error creating new gateway`);
      console.log(error.stack);
    }

    await gateway.connect(connectionProfile,
        	  {
              wallet,
              identity:            adminUserName,
              discovery:           { enabled: false, localhost: bLocalHost },
              eventHandlerOptions: { strategy: null }
      		  });
    console.log ("Connected to gateway");
    network =  await gateway.getNetwork (channelName);
    console.log ("Connected to channel, " + channelName);

    contract =  await network.getContract (chaincodeID);
    console.log ("Connected to chaincode, ", chaincodeID);
    console.log ('...........................');

    await endNetworkConnect();
    console.log ("<<< Exit: function, connectToNetwork");
}

async function getRegisteredUsers() {
    console.log (">>>  Function getRegisteredUsers... ")

    var client, fabric_ca_client, idService;

    try {
       client = gateway.getClient();
    } catch (error) {
       console.log(`Error in call to gateway.getClient: ${error}`);
       console.log(error.stack);
       throw (`Error in call to gateway.getClient: ${error}`);
    }

    try {
      fabric_ca_client = client.getCertificateAuthority();
    } catch (error) {
      console.log(`Error in call to client.getCertificateAuthority: ${error}`);
      console.log(error.stack);
      throw (`Error in call to client.getCertificateAuthority: ${error}`);
    }

    try {
       idService = fabric_ca_client.newIdentityService();
    } catch (error) {
       console.log(`Error in call to fabric_ca_client.newIdentityService: ${error}`);
       console.log(error.stack);
       throw (`Error in call to fabric_ca_client.newIdentityService: ${error}`);
    }

    var adminIdentity = await gateway.getCurrentIdentity();  //  which is org1admin

    //  user must be a hf.registrar
    try {
        var userList = await idService.getAll(adminIdentity);

        let identities = userList.result.identities;
        let result = [];
        let tmp;
        if (identities != undefined) {
          for (var i =0; i < identities.length; i++) {
              tmp = {};
              tmp.id = identities[i].id;
              tmp.approle = getRole (identities[i]);
              result.push(tmp);
          }
        }
        console.log ("<<<  Function getRegisteredUsers... ")
        return result;
    } catch (error) {
        console.log (" Function getRegisteredUsers... 7:   Error")
        console.log(`Error in call to idService.getAll(user);: ${error}`);
        console.log(error.stack);
        console.log ("<<<  Function getRegisteredUsers... ")
        throw (`Error in call to idService.getAll(user);: ${error}`);
    }
}
 //  function registerUser
 //  Purpose: Utility function for registering users with HL Fabric CA.
 //  See POST api for details
 //  Note:  unable to registerUser with user defined attributes (example:  approle)
async function registerUser(userid, pwd, approle) {
     console.log(">>>  Function registerUser...");
     console.log("\n (userid, pwd, approle): (" + userid + ", " + pwd +  ", " + approle + ")" );

     //////////////  begin register ////////////////////////////
     const caURL = connectionProfile.certificateAuthorities['ca.example.com'].url;
     const caclient = new FabricCAClient(caURL);

     // Register the user
     let certAttributes = [];
     certAttributes.push({
         "name":  "hf.Registrar.Attributes",     // hack to add attr to registered user
         "value": "approle=auction.*",
         "ecert": true
     });
     certAttributes.push({
         "name":  "approle",     // application role
         "value": approle,      //  bidder or auctioneer
         "ecert": true
     });

     var newUserDetails = {
         enrollmentID: userid
         , enrollmentSecret: pwd
         , role: "user"
         , affiliation: org1Affiliation
         // , profile: 'tls'
         //, attrs: certAttributes
         , maxEnrollments: -1   //  no maximum
     };

     //  Register is done using admin signing authority
     //  get adminIdentity from the global variable "gateway" in which admin identity has been loaded.
     const adminIdentity =  gateway.getCurrentIdentity() ;
     //console.log ("Function registerUser:  adminIdentity = " + adminIdentity);

     caclient.register(newUserDetails, adminIdentity)
         .then((newPwd) => {
             //  if a password was set in 'enrollmentSecret' field of newUserDetails,
             //  the same password is returned by "register".
             //  if a password was set in 'enrollmentSecret' field of newUserDetails,
             //  then a generated password is returned by "register".
             console.log("\n---------------------------------------------------");
             console.log('\n Secret returned from call to register: ' + newPwd);
             console.log("\n---------------------------------------------------");

             return newPwd;
         },
             (error) => {
                 console.log("\n----------------------------------------");
                 console.log('Error in register(): ' + error);
                 console.log("\n----------------------------------------");
                 return error;
             });
}  //  end of function registerUser

async function enrollUser (userName, secret) {
    console.log (">>> Entry: function, enrollUser...");
    try {
        // Check to see if we have already enrolled the user.
        const userExists = await wallet.exists(userName);
        if (userExists) {
           var result =  {
                'status': {
                  'rc': USER_EXISTS,
                  'msg': 'An identity for the user ' + userName + ' already exists in the wallet' }
              }

        console.log('An identity for the user ' + userName + ' already exists in the wallet');
        return result;
        }

        //  get CA url from connection_profile
        // Create a new CA client for interacting with the CA.
        const caURL = connectionProfile.certificateAuthorities['ca.example.com'].url;
        const caclient = new FabricCAClient(caURL);

        const enrollment = await caclient.enroll(
            { enrollmentID: userName,
              enrollmentSecret: secret});
        //    affiliation: org1Affiliation });

        const identity = await X509WalletMixin.createIdentity(orgName, enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(userName, identity);

        //  return success
        var result =
        {
          "status": {  'rc': SUCCESS,
          'msg': 'Successfully enrolled user ' + userName + 'and imported it into the wallet' }
        };
        console.log('Successfully enrolled user ' + userName + ' and imported it into the wallet');
        return result;

    } catch (error) {
      var result =
      {
        "status": {  'rc': USER_UNAUTHORIZED,
        'msg': 'Failed to enroll user ' + userName + ': ${error}'  }
      };

      console.error( 'Failed to enroll user ' + userName + ': ${error}');
      throw (result);
    }

    //  console.log ("<<< Exit: function, enrollUser");
}


//  function setUserContext
//  Purpose:  to set the context to the user (who called this api)
//            All subsequent calls using that gateway / contract will be on this user's behalf.
//  Input:  userName - which has been registered;  If not enrolled, this function enrolls.
//  Output:  if not error returns SUCCESS else throws an exception
//          Also, (Global variable) contract will be set to this user's context
//          All further transactions using this contract will be submitted using
//          this userName
async function setUserContext (userName, pwd) {
    console.log ('>>> Entry: function setUserContext ....');

    try {
        //  verify if user is registered
        await enrollUser(userName, pwd);
    } catch (error) {
      throw (error);
    }

    try {
        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,  //  * * * set context to this userName   * * *
            wallet: wallet,
            discovery: { enabled: false, asLocalhost: bLocalHost }
        };

        // Connect to gateway using application specified parameters
        //  using local variable, userGateway
        console.log('Connect to Fabric gateway for userName: ' + userName);
        let userGateway = new Gateway ();
        await userGateway.connect(connectionProfile, connectionOptions);

        console.log ("Connected to gateway");
        network =  await userGateway.getNetwork (configdata["channel_name"]);
        console.log ("Connected to channel, " + configdata["channel_name"]);

        //  contract is global variable, used by invoke and query functions
        contract =  await network.getContract (configdata["smart_contract_name"]);
        console.log ("Connected to chaincode, ", configdata["smart_contract_name"]);
        console.log ('...........................');
        //  return success
        var result =
        {
          "status": {  'rc': SUCCESS,
          'msg': 'Successfully set user context to  user:  ' + userName }
        };
        return result;
        }
    catch (error) {
        var result =
        {
          "status": {  'rc': FAILURE,
          'msg': 'setUserContext failed for userName,' + userName + ' : ' + error }
        };
        console.error('setUserContext failed for userName,' + userName );
        throw (result);
      }
}  //  end of UserContext(userName)

async function invoke(userName, txName, ...args) {
    console.log (">>> In function, fabricClient:invoke... ");
    console.log ("userName =***" + userName + "***");
    console.log ("txName =  ", txName);
    console.log ("args =  ", args);

    try {
    await setUserContext (userName,secret);
    }  catch (error) {
        throw (error);
    }

    var result = contract.submitTransaction(txName,...args);
    return result.then((response) => {
    // process response
    console.log('Submitted transaction successfully');

    console.log ('...........................');
    console.log ("Response(buffer): " ,  response);
    console.log ('...........................');

    //  convert buffer to string
    var bufferData = {
                           "type" : "Buffer",
                           "data" : []
                    };
       bufferData["data"] = response;
       strResponse = String.fromCharCode.apply (null, bufferData["data"]);

    console.log ("Response (string): ", strResponse);
    console.log ('...........................');

    //console.log ('If base64 encoded, to decode the response, use ... echo <ResponseData> | base64 -d - ; echo "  "');
    //console.log ("-------------------------------------");

    return Promise.resolve(strResponse);
    },(error) =>
    {
       //  handle error if transaction failed
       console.log('Error thrown from tx promise',error);
       return Promise.reject(error);
    });
}

async function query (userName, txName, ...args) {
    console.log (">>> In function, fabricClient.query... ");
    console.log ("userName =***" + userName + "***");
    console.log ("txName =  ", txName);
    console.log ("args =  ", args);

    await setUserContext (userName,secret);

    var result = contract.evaluateTransaction(txName,...args);
    return result.then((response) => {
    // process response
    console.log('Submitted query successfully');

    console.log ('...........................');
    console.log ("Response(buffer): " ,  response);
    console.log ('...........................');

    //  convert buffer to string
    var bufferData = {
                            "type" : "Buffer",
                            "data" : []
                     };
        bufferData["data"] = response;
        strResponse = String.fromCharCode.apply (null, bufferData["data"]);

    console.log ("Response (string): ", strResponse);
    console.log ('...........................');

    //console.log ('If base64 encoded, to decode the response, use ... echo <ResponseData> | base64 -d - ; echo "  "');

    return Promise.resolve(strResponse);
    },(error) =>
    {
        //  handle error if transaction failed
        console.log('Error thrown from tx promise',error);
        return Promise.reject(error);
    });

    console.log ("<<< function, fabricClient.query: ");
}

//  Usage:  beginNetworkConnect => connectToFabric => endNetworkConnect
//    connectToFabric is application agnostic;
//    beginNetworkConnect and endNetworkConnect can be used for application specific functions
async function beginNetworkConnect() {
  console.log (">>> In function, fabricClient.beginNetworkConnect... ");
  //  read config data
  //  register and enroll org1admin in config data
  //  Todo:register and enroll all users in config data
  //  connect to network
  //  wait for further calls

  await readConfigData ();          //  from config.json

  //  register and enroll admin user read from config.json
  await enrollUser(adminUserName, secret);

  console.log ("<<< function, fabricClient.beginNetworkConnect: ");

}

async function endNetworkConnect () {
  console.log (">>> In function, fabricClient.endNetworkConnect: ");

/*
  try {
      //  TODO:  SJ:  getRegisteredUsers is used here for testing;
      //  remove before checking in
      let list = await getRegisteredUsers();
      var tmp;
      if (list != undefined) {
          for (var i =0; i < list.length; i++) {
              console.log ("list[" + i + "] = ", list[i]);
          }
      }
  } catch (error) {
      console.log ("  In function, fabricClient.endNetworkConnect: " + error );
  }
*/
  console.log ("<<< function, fabricClient.endNetworkConnect ");

}

async function readConfigData () {
  console.log (">>> In function, readConfigData: ");

        // Read configuration file which gives
        //  1.  connection profile - that defines the blockchain network and the endpoints for its CA, Peers
        //  2.  channel name
        //  3.  chaincode name
        //  4.  wallet - collection of certificates
        //  5.  adminUserName - identity to be used for performing transactions, initially
        //  6.  bLocahHost

      const platform = process.env.PLATFORM || 'LOCAL';
      configdata = JSON.parse(fs.readFileSync('config.json', 'utf8'));

      // A wallet stores a collection of identities
      const walletLocation = configdata["wallet"];
      console.log ("walletLocation = ",walletLocation);
      wallet =  new FileSystemWallet(walletLocation);

      // Parse the connection profile
      const ccpPath = path.resolve(__dirname, configdata["connection_profile_filename"]);
      console.log ("ccpPath = ",ccpPath);

      // Load connection profile; will be used to locate a gateway
      connectionProfile = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
      console.log ("Connection Profile loaded");

      adminUserName = configdata["admin_user_name"];
      console.log ("admin user name = ", adminUserName);
      secret = "adminpw";  //  same hardcoded pw for all users, for dev purposes

      bLocalHost = true;
      console.log ("localhost  = " + bLocalHost);
}

function getRole (identity){
    console.log (">>> function getRole: ");

    var attr = identity.attrs;
    if (identity.id == "admin")
        return "admin";

    for (var i=0; i < attr.length; i++) {
        if (attr[i].name == "approle")
            return attr[i].value;
    }
    return "";
}

module.exports = {
    connectToNetwork:connectToNetwork,
    getRegisteredUsers:getRegisteredUsers,
    setUserContext:setUserContext,
    invoke:invoke,
    query:query,
    enrollUser: enrollUser
}
