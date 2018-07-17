const { readFileSync, writeFileSync } = require('fs')
const path = require('path')
const parameterize = require('parameterize')
const mustache = require('mustache')
const protobuf = require('protobufjs')
const template = readFileSync(path.resolve(__dirname, 'source', 'slate.mustache'), 'utf8')
const protocJson = require('./tmp/broker-proto.json')

const brokerProto = protobuf.loadSync(path.resolve(__dirname, 'tmp', 'broker.proto'))
// TODO: replace protocJson with brokerProto entirely

protocJson.files.forEach(inputFile => {
  inputFile.enums.forEach(enumb => {
    enumb.id = parameterize(enumb.longName)
  })

  // add the google protobuf message
  inputFile.messages.push({
    name: 'Empty',
    longName: 'google.protobuf.Empty',
    fullName: '.google.protobuf.Empty',
    description: '',
    hasFields: false,
    hasExtensions: false,
    extensions: [],
    fields: []
  })

  inputFile.messages.forEach(message => {
    message.id = parameterize(message.longName)

    message.enums = []

    message.fields.forEach(field => {
      field.id = parameterize(field.longType)
      // mark the messages and enums that we use so we can reference back
      const enumOrMessage = inputFile.messages.concat(inputFile.enums).find(el => el.longName === field.longType)

      // scalar types don't exist in this set, so we skip those
      if (enumOrMessage) {
        enumOrMessage.usedBy = enumOrMessage.usedBy || []
        enumOrMessage.usedBy.push({
          name: message.longName,
          id: message.id
        })
        enumOrMessage.usedBy[0].first = true
      }
    })
  })

  // loop over again to move sub-enums to their proper message
  inputFile.messages.forEach(message => {
    message.fields.forEach(field => {
      if (field.longType.startsWith(message.longName)) {
        const [ enumb ] = inputFile.enums.splice(inputFile.enums.findIndex(enumb => enumb.longName === field.longType), 1)
        message.enums.push(enumb)
      }
    })
  })

  inputFile.services.forEach(service => {
    service.id = parameterize(service.longName)

    service.methods.forEach(method => {
      method.id = parameterize(method.name)

      // note: the source library (protoc-gen-doc) mixes up `Full` and `Long` in the request and response types,
      // so we fix them here.
      method.requestTypeId = parameterize(method.requestFullType)
      method.responseTypeId = parameterize(method.responseFullType)

      // Add streaming information, which is left out by protoc-gen-doc
      method.requestStreaming = !!brokerProto.nested[service.longName].methods[method.name].requestStream
      method.responseStreaming = !!brokerProto.nested[service.longName].methods[method.name].responseStream
      method.duplexStreaming = method.requestStreaming && method.responseStreaming
      method.unary = !method.requestStreaming && !method.responseStreaming
      method.requestStreamingOnly = method.requestStreaming && !method.duplexStreaming
      method.responseStreamingOnly = method.responseStreaming && !method.duplexStreaming

      // pull the request and response types in directly for a better user experience
      method.requestTypeEmbedded = inputFile.messages.find(message => message.longName === method.requestFullType)
      if (!method.requestTypeEmbedded) throw new Error(`${method.requestFullType} does not exist`)
      // add an indicator to the message of where it is being used
      method.requestTypeEmbedded.usedBy = method.requestTypeEmbedded.usedBy || []
      method.requestTypeEmbedded.usedBy.push({
        name: method.name,
        id: method.id
      })
      method.requestTypeEmbedded.usedBy[0].first = true

      method.responseTypeEmbedded = inputFile.messages.find(message => message.longName === method.responseFullType)
      if (!method.responseTypeEmbedded) throw new Error(`${method.responseFullType} does not exist`)

      // add an indicator of where the message is being used
      method.responseTypeEmbedded.usedBy = method.responseTypeEmbedded.usedBy || []
      method.responseTypeEmbedded.usedBy.push({
        name: method.name,
        id: method.id
      })
      method.responseTypeEmbedded.usedBy[0].first = true
    })
  })
})

protocJson.scalarValueTypes.forEach(type => {
  type.id = parameterize(type.protoType)
})

writeFileSync(path.resolve(__dirname, 'source', 'index.html.md'), mustache.render(template, protocJson))
