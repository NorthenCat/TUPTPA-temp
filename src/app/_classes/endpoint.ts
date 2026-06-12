import { environment } from './../../environments/environment';
/**
 * Igracias Gen 2 Base Endpoint class
 * https://www.telkomuniversity.ac.id
 * adityazulkarnain@telkomuniversity.ac.id
 */

// Define API URL and API Version Here
/**
 * IG2 API Live
 *
 */
const API_LIVE = 'https://gateway.telkomuniversity.ac.id';
const API = environment.apiUrl;
const APP_CODE = environment.appCode;
// const APP_CODE = 114;

/**
 * General Config
 */
// const API_VERSION = 'v1';

export class Endpoint {

  getUrl(namespace: any, key: any, context: any) {
    /*
    * Endpoint Object you can create object based on endpoint namespace
    * example the namespace of endpoint is user you can create user object on endpoint base object
    * You can create key inside endpoint namespace, key is defined as endpoint namespace key
    * example url is user/profile
    * you can create object like this
    * user : {
    *   profile:`${API}/user/profile`
    * }
    */
    const ENDPOINT = {
      oauth: {
        access_token: `${API}/issueauth`,
        user_profile: `${API}/issueprofile`,
        user_scope: `${API}/issuescope/${APP_CODE}`
      },
      app: {
        faq: `${API}/fc95f9c89cc77a721dbd4048a7d72341/${APP_CODE}/${context}`,
        get_vendor: `${API}/7284293da2527df15447a9ce4b7adfb0/${context}`, ///{id?}/{activestatus?}/{rating?}/{vendortypeid?}/{vendorname?}
        create_vendor: `${API}/cf1cae252819b7bb39fe44c24303fb4e`, 
        update_vendor: `${API}/a2c660df28666f3955449cbc970d1d68`,
        get_vendortype: `${API}/ada3efce15d8068de4689a32a75db2cc/${context}`, ///{id?}
      },
      vendor: {
        get_vendor: `${API}/7284293da2527df15447a9ce4b7adfb0/${context}`, ///{id?}/{activestatus?}/{rating?}/{vendortypeid?}/{vendorname?}
        get_vendortype: `${API}/ada3efce15d8068de4689a32a75db2cc/${context}`, ///{id?}
      }, 
      manajementemplate: {
        
      }
    };
    return ENDPOINT[namespace] && ENDPOINT[namespace][key];
  }
}
