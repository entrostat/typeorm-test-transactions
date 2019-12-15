#!/bin/bash
echo "Running transactional tests over multiple database versions..."
echo "Postgres 11"
cd postgres-11
docker-compose up --abort-on-container-exit
