#!/bin/bash
docker compose up -d
cd opentelemetry-nest-9 && npm run start:dev &
P1=$!
cd opentelemetry-nest-10 && npm run start:dev &
P2=$!
wait $P1 $P2

# open http://localhost:16686/