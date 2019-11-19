
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0

DOCKER=docker
DOCKER_IMAGE = auction_frontend
# exposed in frontend Dockerfile
PORT = 5000

build:
	$(DOCKER) build -t $(DOCKER_IMAGE) --no-cache .

run: 
	docker container prune -f
	$(DOCKER) run --network fabric_basic  -d  \
		-p ${PORT}:${PORT} --name frontend $(DOCKER_IMAGE)
