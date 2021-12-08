import axios from "axios";

export async function getDelegatorInfo() { 
    const url = `https://sds.steemworld.org/delegations_api/getIncomingDelegations/robiniaswap`; // {"time":0,"from":1,"to":2,"vests":3}
    let accounts= [];
    const res = await axios.get(url);
    accounts= res.data.result.rows;
    return accounts;
  }

  export async function getLastPost(author) { 
    const url = `https://sds.steemworld.org/posts_api/getRootPostsByAuthor/${author}`; //col 4 row 0  = son göderi perma linki
    let post = [] ; 
    const res = await axios.get(url);
    post= res.data.result.rows;
    return post;
  }
  export async function getVoterAccount() { 
    const url = `https://sds.steemworld.org/accounts_api/getAccount/robiniaswap`; 
    let post = [] ; 
    const res = await axios.get(url);
    post= res.data.result.rows;
    return post;
    
  }