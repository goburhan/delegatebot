
import { getPostContent } from "../utils/steem";
import { VOTE_BOT_ACCOUNT,VOTE_BOT_KEY, VOTE_PERCENT } from "../config";
import {  getDelegatorInfo , getLastPost } from "../utils/helper";
import schedule from "node-schedule";
import client from "../utils/dsteem"
import { get } from "request";
var dsteem = require('dsteem')
var steem = require('steem');
var fs = require('fs');

const cheerio = require('cheerio');
const rp = require('request-promise');

export async function startVoteBot() {
    console.log("Starting the vote bot...");
    setTimeout( getSpAmount);
    setTimeout( calculateWeight, 5000);
    setTimeout( voteBotActivity, 10000)
  }

  let weights = {};

let timestamp = new Date()

async function calculateWeight(){
    const list = await getDelegatorInfo();
    var i = 0;
    let accounts = [list.length]//accounts name
    let delSp = [list.length]// delegate amount of users
    weights = {}
    const json = require('../../object.json') // voteweigth
    let totalSp = parseInt(json.sp)
    

  

 
    for(i=0;i<list.length;i++){
      accounts[i] = list[i][1] 
      delSp[i] = list[i][3]  
     }
     for(i=0;i<delSp.length;i++){
       totalSp += delSp[i]
     }

     

     for(i=0;i<delSp.length;i++){
      delSp[i] = Math.floor((delSp[i]*15)*100/totalSp)
     if (delSp[i] > 10000){
			delSp[i]  = 10000;
		}else  if (delSp[i] < 1){
			delSp[i]  = 1;
		}
  }

  // for(i=0;i<accounts.length;i++){  // to see all permlinks in delagator list
  //   let veri = getPermLink(accounts[i])
  //   veri.then(function (result) {
  //     console.log(result)
  //    })
  //  }  

  
  for(let k in accounts){
    let weight = delSp[k]
    const delegators = accounts[k]
    weights[delegators] = weight
  }
   return accounts
  
    
}


async function getSpAmount(){

  var url ='https://steemd.com/@robiniaswap';

    rp(url).then((html)=> {
    let sp =[];


      var $ = cheerio.load(html);
       const res = $("p:contains('SP')").text();
        var a =  res.trim();
        var b = a.replace(",", ".");
        sp = b.slice(0, -2);
       // var b = sp.substring(0,7);
       var sonSp=parseFloat(sp);
       console.log('====================================');
       console.log(sonSp)
       console.log('====================================');
       var sampleObject = {sp};

    fs.writeFile("./object.json", JSON.stringify(sampleObject, null, 4), (err) => {
    if (err) {  console.error(err);  return; };
    console.log("File has been created");
});
     })

}

async function  getPermLink(account){
  try {
    let data = await  getLastPost(account)
    let a = data[data.length-1];
    let permLink = a[4];
    return permLink
  } catch(e) {
    return true
  }
}

function getVotingWeight(author) {
  return weights[author];
}

async function isCreatedToday(author, permlink) {
  try {
    const post = await getPostContent(author, permlink);
    const midnight_today = getMidnight();
    return new Date(post.created + "Z") > midnight_today;
  } catch (e) {
    //console.error("Fail to check the creation date of the post", e);
    return true;
  }
}

function getMidnight() {
  const now = new Date();
  // timezone = 9 means +0900 timezone, i.e. Korean timezone
  return daysAgo({ now, days: 0, zero: true, timezone: 9 });
}

export async function hasVotedBy(author, permLink, voter) {
  try {
    const post = await getPostContent(author, permLink);
    const voters = post.active_votes.map((v) => v.voter);
    return voters.includes(voter);
  } catch (e) {
    console.error("Fail to check whether the post has voted or not", e);
    return false;
  }
}

async function hasVotedAuthorToday(author) {
  if (!author) return true;

  const voted_authors = await getRecentlyVotedAuthors();
  if (voted_authors.includes(author)) {
    // the author has been voted today
    console.log("Skip! I already voted the author @%s today", author);
    return true;
  } else {
    return false;
  }
}

async function getRecentlyVotedAuthors() {
  const operations = await getAccountHistory(VOTE_BOT_ACCOUNT, -1, 1000);
  const midnight_today = getMidnight();
  return operations
    .filter((op) => op[1].op[0] === "vote")
    .filter((op) => new Date(op[1].timestamp + "Z") > midnight_today) // within 1 day
    .map((op) => op[1].op[1].author)
    .filter((author) => author !== VOTE_BOT_ACCOUNT);
}



export async function votePost(author , timestamp){
  
  const voter = VOTE_BOT_ACCOUNT
  const permLink = await getPermLink(author)
  const voted = await hasVotedBy(author,permLink,voter)
  const weight = getVotingWeight(author)

  const key = dsteem.PrivateKey.fromLogin(VOTE_BOT_ACCOUNT,VOTE_BOT_KEY,'posting')

   
  if(!weight){
    console.log("Skip , author is not valid stakeholder")
    return;
  }
  // if(voted){
  //   console.log("Skip , Already voted up")
  //   return;
  // }
  const postedToday = isCreatedToday(author,permLink)
  if(!postedToday){
    console.log("Skip post is not created to day ")
    return
  }


  // now let's vote after 3 mins 45 secs (minus 2 seconds to ensure inclusion)
  const vote_time = new Date(new Date(timestamp).getTime() + 298 * 1000);
  console.log(
    "Will vote @%s/%s with weight [%s] at",
    author,
    permLink,
    weight,
    vote_time
  );



// client.broadcast.vote(
//   {
//     voter,
//     author,
//     permLink,
//     weight,
//   },
//   VOTE_BOT_KEY
// )
// console.log("Voted @%s/%s with weight = %s", author, permLink, weight)
 


//   client.broadcast.vote(vote,privateKey).then(
//     function(result) {
//         console.log('success:', result);
//     },
//     function(error) {
//         console.log('error:', error);
//             error.jse_shortmsg + ' - See console for full response.';
//     }
// );


// try{
// await client.broadcast.vote(voter,author,permLink,VOTE_BOT_KEY);
// console.log("Voted @%s/%s with weight = %s", author, permLink, weight);
// } catch (e) {
// console.error(
//   "Failed when vote @%s/%s with weight = %s",
//   author,
//   permLink,
//   weight,
//   e
// );
// }
 
  //  schedule.scheduleJob('42 * * * *'), async () => {
  //   try{
  //     const alreadyVoted = await hasVotedBy(author,permLink,voter);
  //     if(alreadyVoted){
  //       console.log("Failed! I already voted the post @%s/%s",author,permLink)
  //       return;
  //     }
  //     const votedAuthor = await hasVotedAuthorToday(author);
  //     if(votedAuthor){
  //       return;
  //     }
      
        
  //   }
  //   catch (e) {
  //     console.error(
  //       "Failed when vote @%s/%s with weight = %s%s",
  //       author,
  //       permLink,
  //       weight,
  //       e
  //     );
  //       if (e.jse_shortmsg=="( now - voter.last_vote_time ).to_seconds() >= STEEM_MIN_VOTE_INTERVAL_SEC: Can only vote once every 3 seconds."){
  //       const delay_time = new Date(new Date(vote_time).getTime() + 298 * 1000);
  //       console.log(
  //        "2re try Will vote @%s/%s with weight [%s] at",
  //       author,
  //       permLink,
  //       weight,
  //       delay_time
  //        );
  //       await schedule.scheduleJob(delay_time, async () => {
  //         try {
  //           await client.broadcast(
  //             "vote",
  //             {
  //             voter,
  //             author,
  //             permLink,
  //             weight,
  //             },
  //             VOTE_BOT_KEY
  //             );
  //           console.log("2retry Voted @%s/%s with weight = %s", author, permLink, weight);
  //         }catch (e) {
  //           console.error(
  //             "Failed when vote @%s/%s with weight = %s",
  //             author,
  //             permLink,
  //             weight,
  //             e
  //           );
  //               if (e.jse_shortmsg=="( now - voter.last_vote_time ).to_seconds() >= STEEM_MIN_VOTE_INTERVAL_SEC: Can only vote once every 3 seconds."){
  //               const delay_time = new Date(new Date(vote_time).getTime() + 3 * 1000);
  //               console.log(
  //                "3re try Will vote @%s/%s with weight [%s] at",
  //                 author,
  //                permLink,
  //                   weight,
  //                 delay_time
  //                );
  //               await schedule.scheduleJob(delay_time, async () => {
  //                 try {
  //                   await client.broadcast(
  //                     "vote",
  //                     {
  //                     voter,
  //                     author,
  //                     permLink,
  //                     weight,
  //                     },
  //                     VOTE_BOT_KEY
  //                     );
  //                   console.log("3retry Voted @%s/%s with weight = %s", author, permLink, weight);
  //                 }catch (e) {
  //                   console.error(
  //                     "3 Failed when vote @%s/%s with weight = %s",
  //                     author,
  //                     permLink,
  //                     weight,
  //                     e
  //                   );
  //                 }
  //               })
  //               }
  //         }
  //       })
  //       }
  //   }

  // }
}

async function voteBotActivity(){
  const list = await getDelegatorInfo();
  let author = 0 ;
  var i = 0;
    for(i=0;i<list.length;i++){
      author = list[i][1]
      
        votePost(author,timestamp)

    }

   
}

async function scheduleUpdateVotingWeight() {
  const scheduledTime = Date.now; // GTC time very day

  const j = schedule.scheduleJob(scheduledTime, async () => {
    await calculateWeight();
  });

  console.log("Scheduled updating voting weight at", scheduledTime);
}