#!/usr/bin/env bash

# Check if user is root
[ $(id -u) != '0' ] && { echo "${CFAILURE}Error: You must be root to run this script${CEND}"; exit 1; }

cd /data/noderoot/GmudServerNew
git pull
cnpm i
rm -rf ./dist/
tsc
#pm2 stop gmud-server-new
pm2 startOrGracefulReload pm2.yml
