"use strict";

var _voter = require("./bot/voter");

async function main() {
  await (0, _voter.startVoteBot)();
}

main();