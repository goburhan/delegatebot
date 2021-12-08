"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDelegatorInfo = getDelegatorInfo;
exports.getLastPost = getLastPost;
exports.getVoterAccount = getVoterAccount;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getDelegatorInfo() {
  const url = "https://sds.steemworld.org/delegations_api/getIncomingDelegations/robiniaswap"; // {"time":0,"from":1,"to":2,"vests":3}

  let accounts = [];
  const res = await _axios.default.get(url);
  accounts = res.data.result.rows;
  return accounts;
}

async function getLastPost(author) {
  const url = "https://sds.steemworld.org/posts_api/getRootPostsByAuthor/".concat(author); //col 4 row 0  = son göderi perma linki

  let post = [];
  const res = await _axios.default.get(url);
  post = res.data.result.rows;
  return post;
}

async function getVoterAccount() {
  const url = "https://sds.steemworld.org/accounts_api/getAccount/robiniaswap";
  let post = [];
  const res = await _axios.default.get(url);
  post = res.data.result.rows;
  return post;
}