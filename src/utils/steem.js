import steem from "steem";
import { STEEM_API_URLS as API_URLS } from "../config";

steem.api.setOptions({ url: API_URLS[12] });

export default steem;

export function callBridge(method, params) {
    return new Promise(function (resolve, reject) {
      steem.api.call("bridge." + method, params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    }); 
  }

export async function getPostContent(author, permlink) {
    const params = {
      author,
      permlink,
      observer: "",
    };
    return await callBridge("get_post", params);
  }