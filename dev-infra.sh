#!/bin/bash
docker compose up -d
cd opentelemetry-nest-9 && npm run start:dev &
P1=$!
cd opentelemetry-nest-10 && npm run start:dev &
P2=$!
cd opentelemetry-nest-8 && npm run start:dev &
P3=$!
wait $P1 $P2 $P3

# open http://localhost:16686/
# open http://localhost:4409/api
# open http://localhost:4410/api
