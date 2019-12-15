#!/bin/bash
set -x

echo "Testing Postgres 11"
cd postgres-11
docker-compose up
