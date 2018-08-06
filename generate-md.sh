#!/bin/bash

cd $(dirname "$0")

echo "Cleaning working directory"
rm -rf tmp
mkdir tmp

curl -o tmp/broker.proto -s https://raw.githubusercontent.com/sparkswap/broker/master/broker-daemon/proto/broker.proto
# Below can be used for dev
# cp ../broker/broker-daemon/proto/broker.proto tmp/broker.proto

echo "Generating JSON description of proto..."
# Note: this does not support oneof, but there is a PR open for that support
protoc -Itmp --doc_out=json,broker-proto.json:tmp broker.proto || exit 1

echo "Generating markdown from JSON description..."
node slate-markdown-from-protoc-json.js || exit 1