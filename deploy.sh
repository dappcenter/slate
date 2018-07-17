#!/bin/bash

./generate-md.sh

echo "Building html output..."

bundle exec build --clean

echo "Deploying using now.sh"

now build