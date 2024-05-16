#!/bin/bash

source .env
source ./set-permission.sh
docker-compose -p ${CONTAINER_NAME} up -d
docker compose -p ${CONTAINER_NAME} up -d
docker exec -u root -it ${CONTAINER_NAME} /bin/bash set-permission.sh
# docker exec -u root -it ${CONTAINER_NAME} npx prisma migrate deploy
docker exec -u root -it ${CONTAINER_NAME} npx prisma generate
docker logs -n 100 ${CONTAINER_NAME}