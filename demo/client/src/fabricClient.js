/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const { Gateway, Client, FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

////////////////////////////  Global constants  /////////////////
//  errorcodes
const SUCCESS = 0;
const FAILURE  = 1;

/////////////////////////////  input  //////////////////////////////////////////
//  Coming soon... a config.json for these inputs !  ///////////////////////////
const orgName        = 'Org1MSP';
const orgDomainName  = 'org1.example.com';
const userName       = 'Admin';  //  hardcoded !

// Path to msp folder for the Identity whose credentials are to be stored in the wallet
// const mspDir = '/Users/sowmya@ibm.com/dev/SGX/fabric-network-scripts/temp/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/';

const orgMSPUsersDir = '/opt/hyperledger/msp/users/'
var userCredDir = orgMSPUsersDir + userName  + '\@' + orgDomainName + '/msp/';   // Admin@org1.example.com';
console.log ("mspDir = ", userCredDir);

/////////////////////////////  end of input  ///////////////////////////

//  global variables loaded initially
var mspDir;
var connectionProfile;
var wallet;
var credentialsPath;
var signCerts;
var keyfile;
var adminUserName;
var bLocalHost;  //  is this used??


//  other global variables
var strResponse;
var gateway;
var network;
var contract;

//  exported functions

async function readConfigData () {
  console.log (">>> In function, readConfigData: ");

        // Read configuration file which gives
        //  1.  connection profile - that defines the blockchain network and the endpoints for its CA, Peers
        //  2.  channel name
        //  3.  chaincode name
        //  4.  wallet - collection of certificates
        //  5.  username - identity to be used for performing transactions, initially

      const platform = process.env.PLATFORM || 'LOCAL';
      var configdata = JSON.parse(fs.readFileSync('config.json', 'utf8'));

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

/*    //  not used now
      //  Read channel name and chaincode_name
      const channelName = configdata["channel_name"];
      console.log ("channelName = ",channelName);

      const chaincodeName = configdata["chaincode_name"];
      console.log ("chaincodeName = ",chaincodeName);
*/
      adminUserName = configdata["admin_user_name"];
      console.log ("admin user name = ", adminUserName);

      // Path to msp folder for the Identity whose credentials are to be stored in the wallet
      // const mspDir = '/Users/sowmya@ibm.com/dev/SGX/fabric-network-scripts/temp/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/';

      mspDir = configdata["mspDir_docker"] + adminUserName  + '\@' + orgDomainName + '/msp/';   // Admin@org1.example.com';
      // mspDir = configdata["mspDir_mac"] + adminUserName  + '\@' + orgDomainName + '/msp/';   // Admin@org1.example.com';
      console.log ("mspDir = ", mspDir);
      credentialsPath = path.resolve(__dirname, mspDir);

      //  convenience variables for enrollUser
      signCerts = 'signcerts/' + adminUserName + '\@' + orgDomainName + '-cert.pem';
      keyfile = 'keystore/adminKey.pem';


      var i = 0;
      var testStr = configdata["users"][i].username;
      var roleStr = configdata["users"][i].userRole;
      console.log ("users[0] = ", testStr);
      console.log ("users[0].role = ", roleStr);

      var i = 1;
      var testStr = configdata["users"][i].username;
      var roleStr = configdata["users"][i].userRole;
      console.log ("users[0] = ", testStr);
      console.log ("users[0].role = ", roleStr);

      var i = 2;
      var testStr = configdata["users"][i].username;
      var roleStr = configdata["users"][i].userRole;
      console.log ("users[0] = ", testStr);
      console.log ("users[0].role = ", roleStr);

      var i = 3;
      var testStr = configdata["users"][i].username;
      var roleStr = configdata["users"][i].userRole;
      console.log ("users[0] = ", testStr);
      console.log ("users[0].role = ", roleStr);

      var i = 4;
      var testStr = configdata["users"][i].username;
      var roleStr = configdata["users"][i].userRole;
      console.log ("users[0] = ", testStr);
      console.log ("users[0].role = ", roleStr);

      bLocalHost = true;
      console.log ("Local platform = " + platform);
}



//  function setUserContext
//  Purpose:  to set the context to the user (who called this api)
//            so that ACLs can be applied for that user inside chaincode.
//            All subsequent calls using that gateway / contract will be on this user's behalf.
//  Input:  userid - which has been registered and enrolled earlier (so that certificates are
//          available in the wallet)
//  Output:  no explicit output;  (Global variable) contract will be set to this user's context
/*
async function setUserContext (userid, pwd) {
    console.log('In function: setUserContext ....');
        // Verify if user is already enrolled
        const userExists = await wallet.exists(userid);
        if (!userExists) {
            console.log("An identity for the user: " + userid + " does not exist in the wallet");
            console.log('Verify that the user has been registered and enrolled before retrying');
            throw ("identity does not exist for userid: " + userid);
        }

    try {
        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userid,  //  * * * set context to this userid   * * *
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: bLocalHost }
        };

        // Connect to gateway using application specified parameters
        //  using local variable, userGateway
        console.log('Connect to Fabric gateway for userid:' + userid);
        let userGateway = new Gateway ();
        await userGateway.connect(connectionProfile, connectionOptions);

        // Access channel: channel_name
        console.log('Use network channel: ' + configdata["channel_name"]);
        network = await userGateway.getNetwork(configdata["channel_name"]);

        // Get addressability to the smart contract as specified in config
        contract = await network.getContract(configdata["smart_contract_name"]);
        console.log('Userid: ' + userid + ' connected to smartcontract: '
                        + configdata["smart_contract_name"] + ' in channel: ' + configdata["channel_name"]);
        return SUCCESS;
    }
    catch (error) { throw (error);}
}  //  end of UserContext(userid)


//  function getAllUsers
//  Purpose: get all users
async function getAllUsers() {
    console.log("\n---------------  function getAllUsers --------------------");

    let client = gateway.getClient();

    let fabric_ca_client = client.getCertificateAuthority();

    let idService = fabric_ca_client.newIdentityService();

    let user = gateway.getCurrentIdentity();
    let userList = await idService.getAll(user);

    let identities = userList.result.identities;

    let result = [];
    let tmp;
    for (var i =0; i < identities.length; i++) {
        tmp = {};
        tmp.id = identities[i].id;
        tmp.approle = getRole (identities[i]);
        console.log ("tmp.id = " + tmp.id);
        result.push(tmp);
    }
    return result;
}  //  end of function getAllUsers


async function enrollAllUsers() {
  console.log (">>>  Function enrollAllUsers... ")

  //  read from config.json
  //  get all users name
  //  register them with CA
  //  enroll them so that the certificates are available in the local wallet

}
*/

async function addIdentityToWallet() {
    console.log (">>> In function, addIdentityToWallet: ");
    try {
	      const cert = fs.readFileSync(path.join(credentialsPath, signCerts)).toString();
        const key = fs.readFileSync(path.join(credentialsPath, keyfile)).toString();

        // console.log ("cert is " + cert);
        // console.log ("key  is " + key);

	      // Load credentials into wallet
        const identityLabel = userName;
	      const identity = X509WalletMixin.createIdentity(orgName, cert, key);

        //  copies the certificates into the local wallet
        await wallet.import(identityLabel, identity);

    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
}

async function connectToNetwork(channelName, chaincodeID) {
    console.log (">>> In function, connectToNetwork: channelName, chaincodeID = ", channelName, chaincodeID);

readConfigData();
    /*
    try {
      await addIdentityToWallet();
    }  catch (error)  {
      console.log(`Error adding to wallet. ${error}`);
      console.log(error.stack);
    }

    try {
      gateway = await new Gateway();
    }  catch (error) {
      console.log(`Error creating new gateway`);
      console.log(error.stack);
    }

    await gateway.connect(connectionProfile,
        	  {
              wallet,
              identity:            userName,
              discovery:           { enabled: false, localhost: true },
              eventHandlerOptions: { strategy: null }
      		  });
    console.log ("Connected to gateway");
    network =  await gateway.getNetwork (channelName);
    console.log ("Connected to channel, " + channelName);

    contract =  await network.getContract (chaincodeID);
    console.log ("Connected to chaincode, ", chaincodeID);
    */

}

async function submitTransaction(txName, arg1,arg2,arg3,arg4,arg5,arg6) {
         console.log (">>> In function, fabricClient:submitTransaction: ");

         //  is there a better way to do this?
         //  use notation "...args";
         switch  (arguments.length) {
           case 2:
               var result = contract.submitTransaction(txName, arg1);
               break;
           case 3:
               var result = contract.submitTransaction(txName, arg1,arg2);
               break;
           case 4:
               var result = contract.submitTransaction(txName, arg1,arg2,arg3);
               break;
           case 5:
               var result = contract.submitTransaction(txName, arg1,arg2,arg3,arg4);
               break;
           case 6:
               var result = contract.submitTransaction(txName, arg1,arg2,arg3,arg4,arg5);
               break;
           default:
               var result = contract.submitTransaction(txName);
         };

         return result.then((response) => {
         // process response
         console.log('Submitted transaction successfully');

         console.log ("-------------------------------------");
         console.log ("Response(buffer): " ,  response);
         console.log ("-------------------------------------");

         //  convert buffer to string
         var bufferData = {
                                 "type" : "Buffer",
                                 "data" : []
                          };
             bufferData["data"] = response;
             strResponse = String.fromCharCode.apply (null, bufferData["data"]);

         console.log ("Response (string): ", strResponse);
         console.log ("-------------------------------------");

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


module.exports = {
    addIdentityToWallet:addIdentityToWallet,
    connectToNetwork:connectToNetwork,
    submitTransaction:submitTransaction
}
