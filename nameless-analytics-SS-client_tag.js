const claimRequest = require('claimRequest');
const getRequestHeader = require('getRequestHeader');
const getRequestBody = require('getRequestBody');
const getRequestMethod = require('getRequestMethod');
const getRequestPath = require('getRequestPath');
const setResponseHeader = require('setResponseHeader');
const setResponseBody = require('setResponseBody');
const setResponseStatus = require('setResponseStatus');
const returnResponse = require('returnResponse');
const runContainer = require('runContainer');
const log = require('logToConsole');
const JSON = require('JSON');
const Object = require('Object');
const BigQuery = require('BigQuery');
const getTimestampMillis = require('getTimestampMillis');
const getType = require('getType');
const makeNumber = require('makeNumber');
const getContainerVersion = require('getContainerVersion');
const getCookieValues = require('getCookieValues');
const setCookie = require ('setCookie');
const makeString = require('makeString');
const generateRandom = require('generateRandom');
const computeEffectiveTldPlusOne = require('computeEffectiveTldPlusOne');


const endpoint = data.endpoint;
const request_origin = getRequestHeader('Origin');
const request_endpoint = getRequestPath();
const request_method = getRequestMethod();
const allowed_request_method = data.request_method;
const allowed_domains_list = data.allowed_domains_list;
var allowed_domains = '';

const user_cookie_name = 'nameless_analytics_user';
const session_cookie_name = 'nameless_analytics_session';

if(data.enable_logs){log('NAMELESS ANALYTICS');}
if(data.enable_logs){log('TAG CONFIGURATION');}

for(let i = 0; i < allowed_domains_list.length; i++){
  allowed_domains = allowed_domains.concat(', ', allowed_domains_list[i].allowed_domain);
} 
if(data.enable_logs){log('👉 Authorized origins:', allowed_domains.slice(2));}

if(data.enable_logs){log('👉 Endpoint:', endpoint);}

if(data.enable_logs){log('CLAIMING REQUEST...');}


// Claim the request
if (check_origin()){
  if(getRequestPath() === '/' + endpoint){
    if(request_method === 'POST'){
      const event_data = JSON.parse(getRequestBody());
      
      if(event_data && Object.keys(event_data).length > 0){
        if (event_data.event_name == 'get_user_data') { // For cross-domain only 
          claim_request(get_user_data(event_data));
        } else {
          claim_request(build_generic_payload(event_data));
        }
      }
    }
  } else {
    if(data.enable_logs){log('🔴 The request endpoint is not correct');}
    setResponseStatus(500);
    setResponseHeader('Access-Control-Allow-Headers', 'application/json');
    setResponseHeader('Access-Control-Allow-Credentials', 'true');
    setResponseHeader('Access-Control-Allow-Origin', request_origin);
    setResponseBody(JSON.stringify({
      status_code: 500,
      response: '🔴 The request endpoint is not correct'
    }));
    returnResponse();
  }
} else {
  if(data.enable_logs){log('🔴 The request origin is not allowed');}
  setResponseStatus(500);
  setResponseHeader('Access-Control-Allow-Headers', 'application/json');
  setResponseHeader('Access-Control-Allow-Credentials', 'true');
  setResponseHeader('Access-Control-Allow-Origin', request_origin);
  setResponseBody(JSON.stringify({
    status_code: 500,
    response: '🔴 The request origin is not allowed'
  }));
  returnResponse();
}


//Check origin
function check_origin(){
  for(let i = 0; i < allowed_domains_list.length; i++){
    if(computeEffectiveTldPlusOne(request_origin) == computeEffectiveTldPlusOne(allowed_domains_list[i].allowed_domain)){
      return true;
    }
  }
}


// Claim requests
function claim_request(event_data) {
  claimRequest();
  runContainer(event_data, () => {
    setResponseStatus(200);
    setResponseHeader('Access-Control-Allow-Headers', 'application/json');
    setResponseHeader('Access-Control-Allow-Credentials', 'true');
    setResponseHeader('Access-Control-Allow-Origin', request_origin);
    setResponseHeader('Access-Control-Allow-Methods', 'POST');
    setResponseHeader('cache-control', 'no-store');
    setResponseBody(JSON.stringify({
      status_code: 200,
      response: '🟢 Request claimed succesfully',
      data: event_data
    }));
    returnResponse();
  });
  if(data.enable_logs){log('🟢 Request claimed succesfully');}
  if(event_data.event_name == 'get_user_data') {
    if(data.enable_logs){log('SEND EVENT DATA TO BROWSER...');}
    if(data.enable_logs){log('👉 Payload data: ', event_data);}    
  } else{
    send_to_bq(event_data);
  }
}


// ------------------------------------------------------------------------------------------------------------------------------------------------------

// Build paylod user data (For cross-domain only)

function get_user_data(event_data) {
  const info = {
    event_name: event_data.event_name,
    // client_id: getCookieValues(user_cookie_name)[0],
    session_id: getCookieValues(session_cookie_name)[0].split('-')[0]
  };
  
  event_data = info;
  
  return event_data;
}


// Build payload
function build_generic_payload(event_data){
  // Add additional info    
  event_data.event_data.country = getRequestHeader('X-Appengine-Country');
  event_data.event_data.city = getRequestHeader('X-Appengine-City');
  
  event_data.event_data.ss_hostname = getRequestHeader('Host');
  event_data.event_data.ss_container_id = getContainerVersion().containerId;
  
  // Cross domain
  const cross_domain_id = event_data.event_data.cross_domain_id;
  
  if (cross_domain_id) {
    const client_id = cross_domain_id.split('_')[0];
    const session_id = cross_domain_id;
    const current_event_timestamp = event_data.event_timestamp;

    event_data.client_id = cross_domain_id.split('_')[0];
    event_data.session_id = cross_domain_id;
    
    set_user_cookie(user_cookie_name, client_id);
    set_session_cookie(session_cookie_name, session_id + '-' + current_event_timestamp);
  
  // No cross domain
  } else {
    const user_cookie_value = getCookieValues(user_cookie_name)[0];
    const session_cookie_value = getCookieValues(session_cookie_name)[0];
    
    // New user with no session
    if (user_cookie_value === undefined) {
      const new_client_id = makeString(generateRandom(1000000000, 9999999999));
      const new_session_id = new_client_id + '_' + makeString(generateRandom(1000000000, 9999999999));
      const current_event_timestamp = event_data.event_timestamp;
      
      event_data.client_id = new_client_id;
      event_data.session_id = new_session_id;
      
      set_user_cookie(user_cookie_name, new_client_id);
      set_session_cookie(session_cookie_name, new_session_id + '-' + current_event_timestamp);
    
    // Returning user with no session cookie
    } else if (user_cookie_value != undefined && session_cookie_value === undefined) {
      const old_client_id = user_cookie_value;
      const new_session_id = old_client_id + '_' + makeString(generateRandom(1000000000, 9999999999));
      const current_event_timestamp = event_data.event_timestamp;
      
      event_data.client_id = old_client_id;
      event_data.session_id = new_session_id; 
  
      set_user_cookie(user_cookie_name, old_client_id);
      set_session_cookie(session_cookie_name, new_session_id + '-' + current_event_timestamp);
    // Returning user with session cookie  
    } else {
      //check if session is expire
      const old_client_id = user_cookie_value;
      const old_session_id = session_cookie_value.split('-')[0];
      const last_event_timestamp = session_cookie_value.split('-')[1];
      const current_event_timestamp = event_data.event_timestamp;
      
      const timestamp_diff = current_event_timestamp - last_event_timestamp;
      const session_timeout = data.session_timeout || 30;
      const is_session_expire = (timestamp_diff < session_timeout) ? true : false;
      
      // If session is expire
      if (is_session_expire) {
        const new_session_id = old_client_id + '_' + makeString(generateRandom(1000000000, 9999999999));
        
        event_data.client_id = old_client_id;
        event_data.session_id = new_session_id; 
  
        set_user_cookie(user_cookie_name, old_client_id);            
        set_session_cookie(session_cookie_name, new_session_id + '-' + current_event_timestamp);
      // If session is not expire
      } else {
        event_data.client_id = old_client_id;
        event_data.session_id = old_session_id;
        
        set_user_cookie(user_cookie_name, old_client_id);
        set_session_cookie(session_cookie_name, old_session_id + '-' + current_event_timestamp);
      }
    }
  }
    
  return event_data;
} 


// Set user cookie
function set_user_cookie(cookie_name, cookie_value){
  let allowed_domain = '';
  for(let i = 0; i < allowed_domains_list.length; i++){
    if(request_origin.match(allowed_domains_list[i].allowed_domain)){
      allowed_domain = allowed_domains_list[i].allowed_domain;
    }
  }
    
  const cookie_domain = '.' + computeEffectiveTldPlusOne(allowed_domain);
  // const cookie_domain = 'auto';
  const cookie_path = '/';
  const cookie_secure = true;
  const sameSite = "strict";
  const user_max_age = 400 * 24 * 60 * 60;
  const httpOnly = true;
  
  const cookie_options = {
    domain: cookie_domain, 
    path: cookie_path,
    secure: cookie_secure,
    sameSite: sameSite,
    'max-age': user_max_age,
    httpOnly: httpOnly
  };
      
  setCookie(cookie_name, cookie_value, cookie_options);
}


// Set session cookie
function set_session_cookie(cookie_name, cookie_value){
  let allowed_domain = '';
  for(let i = 0; i < allowed_domains_list.length; i++){
    if(request_origin.match(allowed_domains_list[i].allowed_domain)){
      allowed_domain = allowed_domains_list[i].allowed_domain;
    }
  }
    
  const cookie_domain = '.' + computeEffectiveTldPlusOne(allowed_domain);
  // const cookie_domain = 'auto';
  const cookie_path = '/';
  const cookie_secure = true;
  const sameSite = "strict";
  const session_max_age = (makeNumber(data.session_max_age) || 30) * 60;
  const httpOnly = true;
  
  const cookie_options = {
    domain: cookie_domain, 
    path: cookie_path,
    secure: cookie_secure,
    sameSite: sameSite,
    'max-age': session_max_age,
    httpOnly: httpOnly
  };
      
  setCookie(cookie_name, cookie_value, cookie_options);
}


// ------------------------------------------------------------------------------------------------------------------------------------------------------


// Send data to Google BigQuery
function send_to_bq(event_data){
  // Google BigQuery project settings
  const project = {
    projectId: data.bq_project_id,
    datasetId: data.bq_dataset_id,
    tableId: data.bq_table_id
  };
  
  if(data.enable_logs){log('SEND EVENT DATA TO GOOGLE BIGQUERY...');}
  if(data.enable_logs){log('👉 Payload data: ', event_data);}
  
  const payload_copy = JSON.parse(JSON.stringify(event_data));
  
  // Encode data in GA4 style        
  encode_event_data(payload_copy, 'event_data');
  encode_consent_data(payload_copy);
  
  // Write options
  const options = {
    ignoreUnknownValues: data.ignore_unknown_values,
    skipInvalidRows: data.skip_invalid_rows
  };
  
  // Write to Google BigQuery
  BigQuery.insert(project, [payload_copy], options,
    () => {
      if(data.enable_logs){log('🟢 Payload data inserted successfully to ' +  project.projectId + "." + project.datasetId + "." + project.tableId);}
    },
    () => {
      if(data.enable_logs){log('🔴 Payload data not inserted to ' +  project.projectId + "." + project.datasetId + "." + project.tableId);}
    }
  );
}


// Encode event data
function encode_event_data(bq_event_data, prop){
  if(bq_event_data[prop] && Object.keys(bq_event_data[prop]).length > 0){
    var mapped_data = [];
    Object.keys(bq_event_data[prop]).forEach((key) => {
      var temp_data = {};
      // Is string 
      if (getType(bq_event_data[prop][key]) == 'string'){     
        temp_data.name = key;
        temp_data.value = {string: bq_event_data[prop][key] || null};
      // Is number (integer or float)    
      } else if (getType(bq_event_data[prop][key]) == 'number'){
        if(bq_event_data[prop][key] % 1 != 0){
          temp_data.name = key;
          temp_data.value = {float: bq_event_data[prop][key]};
        } else {
          temp_data.name = key;
          temp_data.value = {int: bq_event_data[prop][key]};
        }
      // Is JSON (object or array) 
      } else if (getType(bq_event_data[prop][key]) == 'object' | getType(bq_event_data[prop][key]) == 'array') {
        temp_data.name = key;
        temp_data.value = {json: JSON.stringify(bq_event_data[prop][key])};
      // is null or undefined
      } else if (getType(bq_event_data[prop][key]) == 'null' || getType(bq_event_data[prop][key]) == 'undefined'){
        temp_data.name = key;
        temp_data.value = null;
      }
      mapped_data.push(temp_data);
    });
    bq_event_data[prop] = mapped_data;
  }
}


// Encode consent data
function encode_consent_data(bq_event_data){
  var mapped_data = [];
  Object.keys(bq_event_data.consent_data).forEach((key) => {
    var temp_data = {};
    temp_data.name = key;
    temp_data.value = bq_event_data.consent_data[key];
    mapped_data.push(temp_data);
  });
  bq_event_data.consent_data = mapped_data;
}
