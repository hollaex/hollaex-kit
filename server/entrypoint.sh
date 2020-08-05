#!/bin/bash

echo $1 $2
if [ "$1" == 'api' ]; then
  pm2-runtime start ecosystem.config.js --env production --only server
elif [ "$1" == 'ws' ]; then
  pm2-runtime start ecosystem.config.js --env production --only ws
else
  pm2-runtime start ecosystem.config.js --env production
fi
