#!/bin/bash

./generate-md.sh

cd $(dirname "$0")

echo "Building html output..."

bundle exec middleman build --clean || exit 1

echo "Deploying using now.sh..."
# Because we are deploying to /docs/broker/api, we need that to be our path for zeit - it doesn't strip pathnames
rm -rf now
mkdir now
mkdir now/docs
mkdir now/docs/broker
cp -r build now/docs/broker/api
cp now.json now/now.json

now now || exit 1
now alias $(pbpaste) docs-broker-api.kinesis.network