#!/bin/bash
echo "Running transactional tests over multiple database versions..."
echo ""
echo ""

ROOT=$(pwd)

echo "Postgres 9"
cd $ROOT/postgres-9
docker-compose up --abort-on-container-exit

echo "Postgres 11"
cd $ROOT/postgres-11
docker-compose up --abort-on-container-exit


echo "Postgres 12"
cd $ROOT/postgres-12
docker-compose up --abort-on-container-exit

