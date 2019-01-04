#!/bin/bash

cd $(dirname "$0")

echo "Cleaning working directory"
rm -rf tmp
mkdir tmp

curl -o tmp/broker.proto -s https://raw.githubusercontent.com/sparkswap/broker/master/broker-daemon/proto/broker.proto
mkdir -p tmp/google/api
curl -o tmp/google/api/annotations.proto -s https://raw.githubusercontent.com/sparkswap/broker/master/broker-daemon/proto/google/api/annotations.proto
curl -o tmp/google/api/http.proto -s https://raw.githubusercontent.com/sparkswap/broker/master/broker-daemon/proto/google/api/http.proto

echo "Generating JSON description of proto..."
# Note: this does not support oneof, but there is a PR open for that support
protoc -Itmp --doc_out=json,broker-proto.json:tmp broker.proto || exit 1

echo "Generating markdown from JSON description..."
node slate-markdown-from-protoc-json.js || exit 1