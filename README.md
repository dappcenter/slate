API Docs
========

Getting Started
---------------

### Prerequisites

This project requires Go, Ruby, and Node.js (don't @ me).

0. Make sure you have ruby installed (preferably using a version manager like `rbenv`)
1. Install bundler for ruby
`gem install bundler`
2. Make sure you have go installed
`brew install go`
3. Install protobuf (access to `protoc`)
`brew install protobuf`
4. Install `protoc-gen-doc`
`go get -u github.com/pseudomuto/protoc-gen-doc/cmd/protoc-gen-doc`
5. Make sure you have node.js installed (recommended using nvm)

### Installing dependencies

`bundle install`
`npm install`

### Generating Slate-compatible Markdown

`./generate-md.sh`

### Running the development server

`./dev.sh`

### Deploying

`./deploy.sh`