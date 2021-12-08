"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.STREAM_MODE = void 0;

var _dsteem = require("dsteem");

var _config = require("../config");

const client = new _dsteem.Client(_config.STEEM_API_URLS[0]);
const STREAM_MODE = _dsteem.BlockchainMode;
exports.STREAM_MODE = STREAM_MODE;
var _default = client;
exports.default = _default;