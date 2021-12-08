"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callBridge = callBridge;
exports.default = void 0;
exports.getPostContent = getPostContent;

var _steem = _interopRequireDefault(require("steem"));

var _config = require("../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_steem.default.api.setOptions({
  url: _config.STEEM_API_URLS[12]
});

var _default = _steem.default;
exports.default = _default;

function callBridge(method, params) {
  return new Promise(function (resolve, reject) {
    _steem.default.api.call("bridge." + method, params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async function getPostContent(author, permlink) {
  const params = {
    author,
    permlink,
    observer: ""
  };
  return await callBridge("get_post", params);
}