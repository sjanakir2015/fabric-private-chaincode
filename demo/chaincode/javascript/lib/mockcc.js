/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class MockCC extends Contract {

/*
    async createAuction(ctx, jsonAuction) {
        console.info('>>> Entry: Tx: createAuction');
        var result =
            {
              'status': {  'rc': 0,  'msg': 'Auction created'},
              'id' : '1'
            };
        return JSON.stringify (result);

        console.info('>>> Exit: Tx: createAuction');
    }
    */

    async createAuction(ctx, jsonAuction) {
        console.info('>>> Entry: Tx: createAuction');
        var result =
            {
              "status": {  'rc': 0,  'msg': 'Auction created'},
              "id" : '1',
              "owner": "ECC",
              "name": "ECC Spectrum auction",
              "initialEligibilities": [ ],
              "requiredEligibilityPercentage": 95,
              "clockPriceIncrementPercentage": 10
            };
        return JSON.stringify (result);

        console.info('>>> Exit: Tx: createAuction');
    }

        /* {
owner : $principal
name : “...”,
territories  : [ $territory, $territory, … ]
bidders :[ $principal, $principal, … ],
initialEligibilities : [ $eligibility, $eligibility, ..as many as bidders.. ]
requiredEligibilityPercentage : 95,
clockPriceIncrementPercentage : 10
}
*/
    async getAuctionDetails (ctx, auctionId) {
      console.info('>>> Entry: Tx: getAuctionDetails');

      var result = { "owner" : "ECC", "name" : "Spectrum Auction; Other fields yet to be added", "territories" : ["A", "B", "C", "D"] };
      return JSON.stringify (result);

      console.info('>>> Exit: Tx: getAuctionDetails');
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

      return JSON.stringify (result);

      console.info('>>> Exit: Tx: getAuctionStatus');
    }

    async startNextRound (ctx, auctionId) {
      console.info('>>> Entry: Tx: startNextRound');

      var result =
          {
            "status": {  "rc": 0,  "msg": "Next Round started"}
          };

      return JSON.stringify (result);

      console.info('>>> Exit: Tx: startNextRound');
    }

    async endRound (ctx, auctionId) {
      console.info('>>> Entry: Tx: endRound');

      var result =
          {
            "status": {  "rc": 0,  "msg": "Round Ended"}
          };

      return JSON.stringify (result);

      console.info('>>> Exit: Tx: endRound');
    }

    async submitInitialClockBid (ctx, auctionId, bids) {
      console.info('>>> Entry: Tx: submitInitialClockBid');

      var result =
          {
            "status": {  "rc": 0,  "msg": "Initial Clock Bid submitted"}
          };

      return JSON.stringify (result);

      console.info('>>> Exit: Tx: submitInitialClockBid');
    }

    async submitRegularClockBid (ctx, auctionId, bids) {
      console.info('>>> Entry: Tx: submitRegularClockBid');

      var result =
          {
            "status": {  "rc": 0,  "msg": "Regular Clock Bid submitted"}
          };

      return JSON.stringify (result);

      console.info('>>> Exit: Tx: submitRegularClockBid');
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

      return JSON.stringify (result);

      console.info('>>> Exit: Tx: getRoundInfo');
    }

    async getBidderRoundResults (ctx, auctionId, roundId) {
      console.info('>>> Entry: Tx: getBidderRoundResults');

      var result =
          {
            "status": {  "rc": 0,  "msg": "Round results for Bidder returned."},
            "result": [ { "territoryId" : 1, "postedPrice": 1, "excessDemand": 3, "channelsHold": 3 },
                        { "territoryId" : 2, "postedPrice": 1, "excessDemand": 3, "channelsHold": 3 },
                        { "territoryId" : 3, "postedPrice": 1, "excessDemand": 3, "channelsHold": 3 },
                        { "territoryId" : 4, "postedPrice": 1, "excessDemand": 3, "channelsHold": 3 }
                      ],
            "active": false
          };

      return JSON.stringify (result);

      console.info('>>> Exit: Tx: getBidderRoundResults');
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
                      ],
            "futureEligibility": 10,
            "requiredFutureActivity": 9
          };

      return JSON.stringify (result);

      console.info('>>> Exit: Tx: getOwnerRoundResults');
    }

    async submitAssignBid (ctx, auctionId, bids) {
      console.info('>>> Entry: Tx: submitAssignBid');

      var result =  { "status": {  "rc": 0,  "msg": "Bid for Assignment Phase submitted."} };

      return JSON.stringify (result);

      console.info('>>> Exit: Tx: submitAssignBid');
    }

    async getAssignmentResults (ctx, auctionId) {
      console.info('>>> Entry: Tx: getAssignmentResults');

      var result =
          {
            'status': {  'rc': 0,  'msg': 'Round results for Bidder returned.'},
            'result': [
                        { 'territoryId' : 4, 'assignPrice': 23,
                          'channels': [ {'id': 1, 'price': 1 },
                                        {'id': 2, 'price': 1 }
                                        {'id': 3, 'price': 1 },
                                        {'id': 4, 'price': 1 },
                                        {'id': 5, 'price': 1 },
                                        {'id': 6, 'price': 1 }
                                      ] }
                      ]};

      return JSON.stringify (result);

      console.info('>>> Exit: Tx: getAssignmentResults');
    }
}

module.exports = MockCC;
