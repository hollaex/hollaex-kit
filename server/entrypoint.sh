#!/bin/bash

echo $1 $2
if [ "$1" == 'api' ]; then
  pm2-runtime start ecosystem.config.js --env production --only server
elif [ "$1" == 'ws' ]; then
  pm2-runtime start ecosystem.config.js --env production --only ws
elif [ "$1" == 'queue' ] && [ ! -z "$2" ]; then
  pm2-runtime start ecosystem.config.js --env production --only queue-$2
else
  pm2-runtime start ecosystem.config.js --env production
fi
