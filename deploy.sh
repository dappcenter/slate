#!/bin/bash

./generate-md.sh

echo "Building html output..."

bundle exec middleman build --clean || exit 1

echo "Deploying using now.sh"

now build