---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - javascript

toc_headers:
 - Broker Daemon API Documentation

toc_footers:
  - <a href='https://github.com/lord/slate'>Documentation Powered by Slate</a>

search: true
---


# Introduction

This is the API documentation for the Broker Daemon RPC Server.


# AdminService
The AdminService performs administrative tasks on the BrokerDaemon.

```javascript
const grpc = require('grpc')
const caller = require('grpc-caller')
const PROTO_OPTIONS = {
  convertFieldsToCamelCase: true,
  binaryAsBase64: true,
  longsAsStrings: true,
  enumsAsStrings: true
}
const brokerProto = grpc.load('/path/to/broker.proto', 'proto', PROTO_OPTIONS)
const address = 'localhost:27492'
const adminService = caller(address, brokerProto.AdminService)
```

## HealthCheck
The HealthCheck returns a status of all of the components of the BrokerDaemon.

```javascript
const { engineStatus, relayerStatus } = await adminService.healthCheck({})
console.log({ engineStatus, relayerStatus })
```

> The above command will print:

```json
{
  "engineStatus": [
    {
      "symbol": "BTC",
      "status": "OK"
    },
    {
      "symbol": "LTC",
      "status": "OK"
    },
  ],
  "relayerStatus": "OK"
}
```

### Request Type: [google.protobuf.Empty](#googleprotobufempty)



This message has no parameters.


### Response Type: [HealthCheckResponse](#healthcheckresponse)



| Parameter | Type | Description |
| --------- | ---- | ----------- |
| engine_status | [EngineStatus](#enginestatus) |  |
| relayer_status | [string](#string) |  |



# OrderBookService


## WatchMarket


### Request Type: [WatchMarketRequest](#watchmarketrequest)



| Parameter | Type | Description |
| --------- | ---- | ----------- |
| market | [string](#string) |  |


### Response Type: [WatchMarketResponse](#watchmarketresponse)



| Parameter | Type | Description |
| --------- | ---- | ----------- |
| type | [EventType](#watchmarketresponseeventtype) |  |
| market_event | [MarketEvent](#marketevent) |  |


### <a name="watchmarketresponseeventtype">WatchMarketResponse.EventType</a>


| Name | Number | Description |
| ---- | ------ | ----------- |
| ADD | 0 |  |
| DELETE | 1 |  |



# OrderService


## CreateBlockOrder


### Request Type: [CreateBlockOrderRequest](#createblockorderrequest)



| Parameter | Type | Description |
| --------- | ---- | ----------- |
| market | [string](#string) |  |
| side | [Side](#side) |  |
| amount | [string](#string) | Amounts are expressed in common units for a currency (e.g. BTC) and therefore support decimals
Protobuf does not support a decimal type, so we represent it as a string |
| is_market_order | [bool](#bool) |  |
| limit_price | [string](#string) | Prices are decimals but are represented as strings since Protobuf does not support a decimal type |
| time_in_force | [TimeInForce](#timeinforce) |  |


### Response Type: [CreateBlockOrderResponse](#createblockorderresponse)



| Parameter | Type | Description |
| --------- | ---- | ----------- |
| block_order_id | [string](#string) |  |


## GetBlockOrder


### Request Type: [GetBlockOrderRequest](#getblockorderrequest)



| Parameter | Type | Description |
| --------- | ---- | ----------- |
| block_order_id | [string](#string) |  |


### Response Type: [GetBlockOrderResponse](#getblockorderresponse)



| Parameter | Type | Description |
| --------- | ---- | ----------- |
| status | [BlockOrderStatus](#blockorderblockorderstatus) |  |
| market | [string](#string) |  |
| side | [Side](#side) |  |
| amount | [string](#string) | Amounts are expressed in common units for a currency (e.g. BTC) and therefore support decimals
Protobuf does not support a decimal type, so we represent it as a string |
| is_market_order | [bool](#bool) |  |
| limit_price | [string](#string) | Prices are decimals but are represented as strings since Protobuf does not support a decimal type |
| time_in_force | [TimeInForce](#timeinforce) |  |
| fill_amount | [string](#string) |  |
| open_orders | [Order](#order) |  |
| fills | [Fill](#fill) |  |


## CancelBlockOrder


### Request Type: [CancelBlockOrderRequest](#cancelblockorderrequest)



| Parameter | Type | Description |
| --------- | ---- | ----------- |
| block_order_id | [string](#string) |  |


### Response Type: [google.protobuf.Empty](#googleprotobufempty)



This message has no parameters.


## GetBlockOrders


### Request Type: [GetBlockOrdersRequest](#getblockordersrequest)



| Parameter | Type | Description |
| --------- | ---- | ----------- |
| market | [string](#string) |  |


### Response Type: [GetBlockOrdersResponse](#getblockordersresponse)



| Parameter | Type | Description |
| --------- | ---- | ----------- |
| block_orders | [BlockOrder](#blockorder) |  |



# WalletService


## NewDepositAddress


### Request Type: [NewDepositAddressRequest](#newdepositaddressrequest)



| Parameter | Type | Description |
| --------- | ---- | ----------- |
| symbol | [Symbol](#symbol) |  |


### Response Type: [NewDepositAddressResponse](#newdepositaddressresponse)



| Parameter | Type | Description |
| --------- | ---- | ----------- |
| address | [string](#string) |  |


## GetBalances


### Request Type: [google.protobuf.Empty](#googleprotobufempty)



This message has no parameters.


### Response Type: [GetBalancesResponse](#getbalancesresponse)



| Parameter | Type | Description |
| --------- | ---- | ----------- |
| balances | [Balance](#balance) |  |


## CommitBalance


### Request Type: [CommitBalanceRequest](#commitbalancerequest)



| Parameter | Type | Description |
| --------- | ---- | ----------- |
| symbol | [Symbol](#symbol) |  |
| balance | [int64](#int64) |  |


### Response Type: [google.protobuf.Empty](#googleprotobufempty)



This message has no parameters.



# Message Reference


## Balance


Used in: [GetBalancesResponse](#getbalancesresponse)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| symbol | [string](#string) |  |
| totalBalance | [int64](#int64) |  |
| totalChannelBalance | [int64](#int64) |  |



## BlockOrder


Used in: [GetBlockOrdersResponse](#getblockordersresponse)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| block_order_id | [string](#string) |  |
| market | [string](#string) |  |
| side | [Side](#side) |  |
| amount | [string](#string) | Amounts are expressed in common units for a currency (e.g. BTC) and therefore support decimals
Protobuf does not support a decimal type, so we represent it as a string |
| is_market_order | [bool](#bool) |  |
| limit_price | [string](#string) | Prices are decimals but are represented as strings since Protobuf does not support a decimal type |
| time_in_force | [TimeInForce](#timeinforce) |  |
| status | [BlockOrderStatus](#blockorderblockorderstatus) |  |


### <a name="blockorderblockorderstatus">BlockOrder.BlockOrderStatus</a>


| Name | Number | Description |
| ---- | ------ | ----------- |
| ACTIVE | 0 |  |
| CANCELLED | 1 |  |
| COMPLETED | 2 |  |
| FAILED | 3 |  |



## CancelBlockOrderRequest


Used in: [CancelBlockOrder](#cancelblockorder)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| block_order_id | [string](#string) |  |



## CommitBalanceRequest


Used in: [CommitBalance](#commitbalance)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| symbol | [Symbol](#symbol) |  |
| balance | [int64](#int64) |  |



## CreateBlockOrderRequest


Used in: [CreateBlockOrder](#createblockorder)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| market | [string](#string) |  |
| side | [Side](#side) |  |
| amount | [string](#string) | Amounts are expressed in common units for a currency (e.g. BTC) and therefore support decimals
Protobuf does not support a decimal type, so we represent it as a string |
| is_market_order | [bool](#bool) |  |
| limit_price | [string](#string) | Prices are decimals but are represented as strings since Protobuf does not support a decimal type |
| time_in_force | [TimeInForce](#timeinforce) |  |



## CreateBlockOrderResponse


Used in: [CreateBlockOrder](#createblockorder)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| block_order_id | [string](#string) |  |



## EngineStatus


Used in: [HealthCheckResponse](#healthcheckresponse)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| symbol | [string](#string) |  |
| status | [string](#string) |  |



## Fill


Used in: [GetBlockOrderResponse](#getblockorderresponse)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| order_id | [string](#string) |  |
| fill_id | [string](#string) |  |
| fill_status | [FillStatus](#fillfillstatus) |  |
| amount | [string](#string) | Amounts are expressed in common units for a currency (e.g. BTC) and therefore support decimals
Protobuf does not support a decimal type, so we represent it as a string |
| price | [string](#string) |  |


### <a name="fillfillstatus">Fill.FillStatus</a>


| Name | Number | Description |
| ---- | ------ | ----------- |
| CREATED | 0 |  |
| FILLED | 1 |  |
| EXECUTED | 2 |  |
| COMPLETED | 3 |  |
| REJECTED | 4 |  |



## GetBalancesResponse


Used in: [GetBalances](#getbalances)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| balances | [Balance](#balance) |  |



## GetBlockOrderRequest


Used in: [GetBlockOrder](#getblockorder)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| block_order_id | [string](#string) |  |



## GetBlockOrderResponse


Used in: [GetBlockOrder](#getblockorder)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| status | [BlockOrderStatus](#blockorderblockorderstatus) |  |
| market | [string](#string) |  |
| side | [Side](#side) |  |
| amount | [string](#string) | Amounts are expressed in common units for a currency (e.g. BTC) and therefore support decimals
Protobuf does not support a decimal type, so we represent it as a string |
| is_market_order | [bool](#bool) |  |
| limit_price | [string](#string) | Prices are decimals but are represented as strings since Protobuf does not support a decimal type |
| time_in_force | [TimeInForce](#timeinforce) |  |
| fill_amount | [string](#string) |  |
| open_orders | [Order](#order) |  |
| fills | [Fill](#fill) |  |



## GetBlockOrdersRequest


Used in: [GetBlockOrders](#getblockorders)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| market | [string](#string) |  |



## GetBlockOrdersResponse


Used in: [GetBlockOrders](#getblockorders)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| block_orders | [BlockOrder](#blockorder) |  |



## HealthCheckResponse


Used in: [HealthCheck](#healthcheck)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| engine_status | [EngineStatus](#enginestatus) |  |
| relayer_status | [string](#string) |  |



## MarketEvent


Used in: [WatchMarketResponse](#watchmarketresponse)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| orderId | [string](#string) |  |
| amount | [string](#string) |  |
| price | [string](#string) |  |
| side | [Side](#side) |  |



## NewDepositAddressRequest


Used in: [NewDepositAddress](#newdepositaddress)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| symbol | [Symbol](#symbol) |  |



## NewDepositAddressResponse


Used in: [NewDepositAddress](#newdepositaddress)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| address | [string](#string) |  |



## Order


Used in: [GetBlockOrderResponse](#getblockorderresponse)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| order_id | [string](#string) |  |
| order_status | [OrderStatus](#orderorderstatus) |  |
| amount | [string](#string) | Amounts are expressed in common units for a currency (e.g. BTC) and therefore support decimals
Protobuf does not support a decimal type, so we represent it as a string |
| price | [string](#string) | Prices are decimals but are represented as strings since Protobuf does not support a decimal type |


### <a name="orderorderstatus">Order.OrderStatus</a>


| Name | Number | Description |
| ---- | ------ | ----------- |
| CREATED | 0 |  |
| PLACED | 1 |  |
| FILLED | 2 |  |
| EXECUTED | 3 |  |
| COMPLETED | 4 |  |
| REJECTED | 5 |  |



## WatchMarketRequest


Used in: [WatchMarket](#watchmarket)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| market | [string](#string) |  |



## WatchMarketResponse


Used in: [WatchMarket](#watchmarket)

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| type | [EventType](#watchmarketresponseeventtype) |  |
| market_event | [MarketEvent](#marketevent) |  |


### <a name="watchmarketresponseeventtype">WatchMarketResponse.EventType</a>


| Name | Number | Description |
| ---- | ------ | ----------- |
| ADD | 0 |  |
| DELETE | 1 |  |



## google.protobuf.Empty


Used in: [HealthCheck](#healthcheck), [CancelBlockOrder](#cancelblockorder), [GetBalances](#getbalances), [CommitBalance](#commitbalance)

This message has no parameters.




## Side


Used in: [BlockOrder](#blockorder), [CreateBlockOrderRequest](#createblockorderrequest), [GetBlockOrderResponse](#getblockorderresponse), [MarketEvent](#marketevent)

| Name | Number | Description |
| ---- | ------ | ----------- |
| BID | 0 |  |
| ASK | 1 |  |


## Symbol


Used in: [CommitBalanceRequest](#commitbalancerequest), [NewDepositAddressRequest](#newdepositaddressrequest)

| Name | Number | Description |
| ---- | ------ | ----------- |
| BTC | 0 |  |
| LTC | 1 |  |


## TimeInForce


Used in: [BlockOrder](#blockorder), [CreateBlockOrderRequest](#createblockorderrequest), [GetBlockOrderResponse](#getblockorderresponse)

| Name | Number | Description |
| ---- | ------ | ----------- |
| GTC | 0 |  |
| FOK | 1 |  |
| IOC | 2 |  |



# Scalar Value Types

For more information, see the [proto3 reference](https://developers.google.com/protocol-buffers/docs/proto3#scalar).

| Type | Notes |
| ---- | ----- |
| <a name="double">double</a> |  |
| <a name="float">float</a> |  |
| <a name="int32">int32</a> | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. |
| <a name="int64">int64</a> | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. |
| <a name="uint32">uint32</a> | Uses variable-length encoding. |
| <a name="uint64">uint64</a> | Uses variable-length encoding. |
| <a name="sint32">sint32</a> | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s. |
| <a name="sint64">sint64</a> | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s. |
| <a name="fixed32">fixed32</a> | Always four bytes. More efficient than uint32 if values are often greater than 2^28. |
| <a name="fixed64">fixed64</a> | Always eight bytes. More efficient than uint64 if values are often greater than 2^56. |
| <a name="sfixed32">sfixed32</a> | Always four bytes. |
| <a name="sfixed64">sfixed64</a> | Always eight bytes. |
| <a name="bool">bool</a> |  |
| <a name="string">string</a> | A string must always contain UTF-8 encoded or 7-bit ASCII text. |
| <a name="bytes">bytes</a> | May contain any arbitrary sequence of bytes. |
