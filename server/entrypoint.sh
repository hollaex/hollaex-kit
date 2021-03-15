#!/bin/bash

echo $1
if [ "$1" == 'api' ]; then
  pm2-runtime start ecosystem.config.js --env production --only server
elif [ "$1" == 'stream' ]; then
  pm2-runtime start ecosystem.config.js --env production --only stream
elif [ "$1" == 'plugins' ]; then
  pm2-runtime start ecosystem.config.js --env production --only plugins
else
  pm2-runtime start ecosystem.config.js --env production
fi
