const { readFileSync, writeFileSync } = require('fs')
const path = require('path')
const p = require('parameterize')
// parameterize doesn't replace periods (.) with hyphens, so we do it manually
const parameterize = function (str) {
  return p(str.replace(/\./g, '-'))
}
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

  // add the google messages back
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
    console.log(message.longName, message.id)

    message.enums = []
    message.messages = []

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

  // loop over again to move sub-enums and sub-messages to their proper message
  inputFile.messages.slice().forEach(message => {
    message.fields.forEach(field => {
      if (field.longType.startsWith(message.longName)) {
        const enumIndex = inputFile.enums.findIndex(enumb => enumb.longName === field.longType)

        if (enumIndex !== -1) {
          const [ enumb ] = inputFile.enums.splice(enumIndex, 1)
          message.enums.push(enumb)
        } else {
          const messageIndex = inputFile.messages.findIndex(message => message.longName === field.longType)
          const [ submessage ] = inputFile.messages.splice(messageIndex, 1)
          message.messages.push(submessage)
        }
      }
    })
  })


  // remove the extra google messages
  inputFile.messages.splice(inputFile.messages.findIndex(msg => msg.longName === 'google'), 1)
  inputFile.messages.splice(inputFile.messages.findIndex(msg => msg.longName === 'google.protobuf'), 1)

  inputFile.services.forEach(service => {
    service.id = parameterize(service.longName)

    service.methods.forEach(method => {
      method.id = parameterize(method.name)

      method.requestTypeId = parameterize(method.requestLongType)
      method.responseTypeId = parameterize(method.responseLongType)

      console.log(method.requestLongType, method.requestTypeId)

      // Add streaming information, which is left out by protoc-gen-doc
      method.requestStreaming = !!brokerProto.nested.broker.nested.rpc[service.longName].methods[method.name].requestStream
      method.responseStreaming = !!brokerProto.nested.broker.nested.rpc[service.longName].methods[method.name].responseStream
      method.duplexStreaming = method.requestStreaming && method.responseStreaming
      method.unary = !method.requestStreaming && !method.responseStreaming
      method.requestStreamingOnly = method.requestStreaming && !method.duplexStreaming
      method.responseStreamingOnly = method.responseStreaming && !method.duplexStreaming

      // pull the request and response types in directly for a better user experience
      method.requestTypeEmbedded = inputFile.messages.find(message => message.longName === method.requestLongType)
      if (!method.requestTypeEmbedded) throw new Error(`${method.requestLongType} does not exist`)
      // add an indicator to the message of where it is being used
      method.requestTypeEmbedded.usedBy = method.requestTypeEmbedded.usedBy || []
      method.requestTypeEmbedded.usedBy.push({
        name: method.name,
        id: method.id
      })
      method.requestTypeEmbedded.usedBy[0].first = true

      method.responseTypeEmbedded = inputFile.messages.find(message => message.longName === method.responseLongType)
      if (!method.responseTypeEmbedded) throw new Error(`${method.responseLongType} does not exist`)

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
