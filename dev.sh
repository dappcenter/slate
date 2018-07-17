#!/bin/bash

./generate-md.sh || exit 1

echo "Starting development server..."

bundle exec middleman server