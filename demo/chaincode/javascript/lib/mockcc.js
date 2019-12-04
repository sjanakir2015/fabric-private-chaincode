/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class MockCC extends Contract {


    async createAuction(ctx, jsonAuction) {
        console.info('>>> Entry: Tx: createAuction');
        var result =
            {
              'status': {  'rc': 0,  'msg': 'Auction created'},
              'id' : '1'
            };
        console.info('>>> Exit: Tx: createAuction');
        return JSON.stringify (result);

    }


    async getAuctionDetails (ctx, auctionId) {
      console.info('>>> Entry: Tx: getAuctionDetails');

      var result =
      {
         "owner" : {
          "id": 1,
          "name": "A-Telco",
          "dn": "user1"
        },
    "id": 1,
    "owner": {
      "id": 1,
      "mspid": "org4",
      "dn": "user4",
      "name": "ECC"
    },
    "name": "ECC Spectrum auction",
    "territories": [
      {
        "id": 1,
        "name": "Elbograd",
        "isHighDemand": false,
        "minprice ": 12,
        "channels":
        [
          {
          "id": 1,
          "name": "1",
          "impairment": 80
        }, {
          "id": 2,
          "name": "2",
          "impairment": 80
        }, {
          "id": 3,
          "name": "2",
          "impairment": 80
        }, {
          "id": 2,
          "name": "2",
          "impairment": 80
        }, {
          "id": 2,
          "name": "2",
          "impairment": 80
        }, {
          "id": 2,
          "name": "2",
          "impairment": 80
        }, {
          "id": 2,
          "name": "2",
          "impairment": 80
        }, {
          "id": 2,
          "name": "2",
          "impairment": 80
        }, {
          "id": 2,
          "name": "2",
          "impairment": 80
        }, {
          "id": 2,
          "name": "2",
          "impairment": 80
        }]
      },
      {
        "id": 2,
        "name": "Mudberg",
        "isHighDemand": false,
        "minprice ": 15,
        "channels": [{
          "id": 1,
          "name": "1",
          "impairment": 70
        }, {
          "id": 2,
          "name": "2",
          "impairment": 71
        }, {
          "id": 3,
          "name": "2",
          "impairment": 72
        }, {
          "id": 2,
          "name": "2",
          "impairment": 73
        }, {
          "id": 2,
          "name": "2",
          "impairment": 74
        }, {
          "id": 2,
          "name": "2",
          "impairment": 75
        }, {
          "id": 2,
          "name": "2",
          "impairment": 76
        }, {
          "id": 2,
          "name": "2",
          "impairment": 77
        }, {
          "id": 2,
          "name": "2",
          "impairment": 78
        }, {
          "id": 2,
          "name": "2",
          "impairment": 79
        }]
      },
      {
        "id": 3,
        "name": "Deserton",
        "isHighDemand": false,
        "minprice ": 9,
        "channels": [{
          "id": 1,
          "name": "1",
          "impairment": 90
        }, {
          "id": 2,
          "name": "2",
          "impairment": 91
        }, {
          "id": 3,
          "name": "2",
          "impairment": 93
        }, {
          "id": 2,
          "name": "2",
          "impairment": 95
        }, {
          "id": 2,
          "name": "2",
          "impairment": 97
        }, {
          "id": 2,
          "name": "2",
          "impairment": 99
        }]
      },
      {
        "id": 4,
        "name": "Phlimsk",
        "isHighDemand": false,
        "minprice ": 18,
        "channels": [{
          "id": 1,
          "name": "1",
          "impairment": 60
        }, {
          "id": 2,
          "name": "2",
          "impairment": 61
        }, {
          "id": 3,
          "name": "2",
          "impairment": 63
        }, {
          "id": 2,
          "name": "2",
          "impairment": 65
        }, {
          "id": 2,
          "name": "2",
          "impairment": 67
        }, {
          "id": 2,
          "name": "2",
          "impairment": 69
        }]
      }
    ],
    "bidders": [{
        "id": 1,
        "name": "A-Telco",
        "dn": "user1"
      },
      {
        "id": 2,
        "name": "B-Net",
        "dn": "user2"
      },
      {
        "id": 3,
        "name": "C-Mobil",
        "dn": "user3"
      }
    ],
    "initialEligibilities": [{
        "bidId": 1,
        "number": 10
      },
      {
        "bidId": 2,
        "number": 10
      },
      {
        "bidId": 3,
        "number": 10
      }
    ],
    "activityRequirementPercentage":95,
    //  earlier :  "requiredEligibilityPercentage": 95,
    "clockPriceIncrementPercentage": 10
  };
      console.info('>>> Exit: Tx: getAuctionDetails');
      return JSON.stringify (result);

    }

    async getAuctionStatus (ctx, auctionId) {
      console.info('>>> Entry: Tx: getAuctionStatus');

      var result =
          {
            "status": {  "rc": 0,  "msg": "Auction status"},
            "state": "clock",
            "round": 2,
            "roundActive": false
          };

      console.info('>>> Exit: Tx: getAuctionStatus');
      return JSON.stringify (result);
    }

    async startNextRound (ctx, auctionId) {
      console.info('>>> Entry: Tx: startNextRound');

      var result =
          {
            "status": {  "rc": 0,  "msg": "Next Round started"}
          };

      console.info('>>> Exit: Tx: startNextRound');
      return JSON.stringify (result);
    }

    async endRound (ctx, auctionId) {
      console.info('>>> Entry: Tx: endRound');

      var result =
          {
            "status": {  "rc": 0,  "msg": "Round Ended"}
          };

      console.info('>>> Exit: Tx: endRound');
      return JSON.stringify (result);
    }

    async submitInitialClockBid (ctx, auctionId, bids) {
      console.info('>>> Entry: Tx: submitInitialClockBid');

      var result =
          {
            "status": {  "rc": 0,  "msg": "Initial Clock Bid submitted"}
          };

      console.info('>>> Exit: Tx: submitInitialClockBid');
      return JSON.stringify (result);
    }

    async submitRegularClockBid (ctx, auctionId, bids) {
      console.info('>>> Entry: Tx: submitRegularClockBid');

      var result =
          {
            "status": {  "rc": 0,  "msg": "Regular Clock Bid submitted"}
          };

      console.info('>>> Exit: Tx: submitRegularClockBid');
      return JSON.stringify (result);

    }

    async getRoundInfo (ctx, auctionId, roundId) {
      console.info('>>> Entry: Tx: getRoundInfo');

      var result =
          {
            "status": {  "rc": 0,  "msg": "Round Info returned; Please note: in initial round, clockPrice = minPrice."},
            "prices": [ { "territoryId" : 1, "minPrice": 1, "clockPrice": 3},
                       { "territoryId" : 2, "minPrice": 1, "clockPrice": 3},
                       { "territoryId" : 3, "minPrice": 1, "clockPrice": 3},
                       { "territoryId" : 4, "minPrice": 1, "clockPrice": 3} ],
            "active": false
          };

      console.info('>>> Exit: Tx: getRoundInfo');
      return JSON.stringify (result);
    }

    async getBidderRoundResults (ctx, auctionId, roundId) {
      console.info('>>> Entry: Tx: getBidderRoundResults');

      var result =
          {
            "status": {  "rc": 0,  "msg": "Round results for Bidder returned."},
            "result": [ { "territoryId" : 1, "postedPrice": 1, "excessDemand": 3, "processedLicenses": 3 },
                        { "territoryId" : 2, "postedPrice": 1, "excessDemand": 3, "processedLicenses": 3 },
                        { "territoryId" : 3, "postedPrice": 1, "excessDemand": 3, "processedLicenses": 3 },
                        { "territoryId" : 4, "postedPrice": 1, "excessDemand": 3, "processedLicenses": 3 }
                      ],
            "futureEligibility": 10,
            "requiredFutureActivity": 9
            //, "active": false  //  this field has been removed in current version of the doc
          };

      console.info('>>> Exit: Tx: getBidderRoundResults');
      return JSON.stringify (result);
    }

    async getOwnerRoundResults (ctx, auctionId, roundId) {
      console.info('>>> Entry: Tx: getOwnerRoundResults');

      var result =
          {
            "status": {  "rc": 0,  "msg": "Round results for Auction Owner returned."},
            "result": [ { "territoryId" : 1, "postedPrice": 1, "excessDemand": 8, "activeBidders": 3 },
                        { "territoryId" : 2, "postedPrice": 1, "excessDemand": 8, "activeBidders": 3 },
                        { "territoryId" : 3, "postedPrice": 1, "excessDemand": 8, "activeBidders": 3 },
                        { "territoryId" : 4, "postedPrice": 1, "excessDemand": 8, "activeBidders": 3 }
                      ]
          };

      console.info('>>> Exit: Tx: getOwnerRoundResults');
      return JSON.stringify (result);
    }

    async submitAssignBid (ctx, auctionId, bids) {
      console.info('>>> Entry: Tx: submitAssignBid');

      var result =  { "status": {  "rc": 0,  "msg": "Bid for Assignment Phase submitted."} };

      console.info('>>> Exit: Tx: submitAssignBid');
      return JSON.stringify (result);

    }

    async getAssignmentResults (ctx, auctionId) {
      console.info('>>> Entry: Tx: getAssignmentResults');

      var result =
          {"status": {  "rc": 0,  "msg": "Round results for Bidder returned."},
            "result":
                        { "bidId": 1,
                        "assignment" :
                        [ {"territoryId": 1, "assignPrice": 23,
                            "channels":[ {"channelId": 1, "price": 1 },
                                         {"channelId": 2, "price": 1 },
                                         {"channelId": 3, "price": 1 },
                                         {"channelId": 4, "price": 1 },
                                         {"channelId": 5, "price": 1 }
                                      ] },
                          {"territoryId": 2, "assignPrice": 23,
                              "channels":[ {"channelId": 1, "price": 1 },
                                           {"channelId": 2, "price": 1 },
                                           {"channelId": 3, "price": 1 },
                                           {"channelId": 4, "price": 1 },
                                           {"channelId": 5, "price": 1 }
                                        ] },
                           {"territoryId": 3, "assignPrice": 23,
                              "channels":[ {"channelId": 1, "price": 1 },
                                           {"channelId": 2, "price": 1 },
                                           {"channelId": 3, "price": 1 },
                                           {"channelId": 4, "price": 1 },
                                           {"channelId": 5, "price": 1 }
                                        ] },
                            {"territoryId": 4, "assignPrice": 23,
                                "channels":[ {"channelId": 1, "price": 1 },
                                             {"channelId": 2, "price": 1 },
                                             {"channelId": 3, "price": 1 }
                                          ] }
                      ]}};
//  territory :  licenses or channels : 5,5,5,3
      console.info('>>> Exit: Tx: getAssignmentResults');
      return JSON.stringify (result);

    }
}

module.exports = MockCC;
