#!/bin/bash
echo "Running transactional tests over multiple database versions..."
echo ""
echo ""

echo "Postgres 11"
cd postgres-11
docker-compose up --abort-on-container-exit

echo "Postgres 12"
cd postgres-12
docker-compose up --abort-on-container-exit

