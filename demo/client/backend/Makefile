
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0

DOCKER=docker
DOCKER_IMAGE = auction_backend
CONTAINER_NAME = client
APP_SRC = ${PWD}
MSP_DIR = ${GOPATH}/src/github.com/hyperledger-labs/fabric-private-chaincode/demo/network/crypto-config/peerOrganizations/org1.example.com/users/

all:  build run

build:
	$(DOCKER) build -t $(DOCKER_IMAGE) --no-cache .

run: 
#	docker kill client
	docker container prune -f
	$(DOCKER) run --network fabric_basic  -d  -v ${APP_SRC}:/usr/src/app \
		-v ${MSP_DIR}:/opt/hyperledger/msp/users/  -p 3000:3000  --name ${CONTAINER_NAME}   $(DOCKER_IMAGE)
