import { b64uDec } from "./utils/helper";

// STEEM CONFIG 
export const STEEM_API_URLS = [
    process.env.STEEM_API_URL || "https://api.steemit.com",
    "https://testnet.steemitdev.com"
  ];

  
  

export const VOTE_PERCENT = 50000; /*set 500% */
export const VOTE_BOT_ACCOUNT =  "inven.cu01";
export const VOTE_BOT_KEY = "5Ka42Y1FvE1U8KkdrKnuYo7UtaGQig5zEdD7fqTt1rpim92SnhA";
