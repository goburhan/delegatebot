"use strict";

var _steemInterface = _interopRequireDefault(require("steem-interface"));

var _config = require("../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_steemInterface.default.init({
  rpc_nodes: _config.STEEM_API_URLS
});