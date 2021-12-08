"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VOTE_PERCENT = exports.VOTE_BOT_KEY = exports.VOTE_BOT_ACCOUNT = exports.STEEM_API_URLS = void 0;

var _helper = require("./utils/helper");

// STEEM CONFIG 
const STEEM_API_URLS = [process.env.STEEM_API_URL || "https://api.steemit.com", "https://testnet.steemitdev.com"];
exports.STEEM_API_URLS = STEEM_API_URLS;
const VOTE_PERCENT = 50000;
/*set 500% */

exports.VOTE_PERCENT = VOTE_PERCENT;
const VOTE_BOT_ACCOUNT = "inven.cu01";
exports.VOTE_BOT_ACCOUNT = VOTE_BOT_ACCOUNT;
const VOTE_BOT_KEY = "5Ka42Y1FvE1U8KkdrKnuYo7UtaGQig5zEdD7fqTt1rpim92SnhA";
exports.VOTE_BOT_KEY = VOTE_BOT_KEY;