const log = require('logToConsole');
const getTimestampMillis = require('getTimestampMillis');

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
const JSON = require('JSON');
const Object = require('Object');
const getType = require('getType');
const makeNumber = require('makeNumber');
const makeString = require('makeString');
const generateRandom = require('generateRandom');
const getContainerVersion = require('getContainerVersion');
const getCookieValues = require('getCookieValues');
const setCookie = require ('setCookie');
const computeEffectiveTldPlusOne = require('computeEffectiveTldPlusOne');
const BigQuery = require('BigQuery');
const Firestore = require('Firestore');
const Math = require('Math');


// ------------------------------------------------------------------------------------------------------------------------------------------------------



const endpoint = data.endpoint;
const request_origin = getRequestHeader('Origin');
const request_endpoint = getRequestPath();
const request_method = getRequestMethod();
const allowed_request_method = data.request_method;
const allowed_domains_list = data.allowed_domains_list;
var allowed_domains = '';

const user_cookie_name = data.user_cookie_name || 'nameless_analytics_user';
const session_cookie_name = data.session_cookie_name || 'nameless_analytics_session';

if(data.enable_logs){log('NAMELESS ANALYTICS');}
if(data.enable_logs){log('CLIENT TAG CONFIGURATION');}

for(let i = 0; i < allowed_domains_list.length; i++){
  const allowed_domains_tld = computeEffectiveTldPlusOne(allowed_domains_list[i].allowed_domain);
  allowed_domains = allowed_domains.concat(', ', allowed_domains_tld);
} 
if(data.enable_logs){log('👉 Authorized origins:', allowed_domains.slice(2));}
if(data.enable_logs){log('👉 Endpoint:', endpoint);}

if(data.enable_logs) {log('CLAIM REQUEST...');}
if(data.enable_logs){log('👉 Request origin:', computeEffectiveTldPlusOne(request_origin));}
if(data.enable_logs){log('👉 Request endpoint:', getRequestPath());}


// Check origin, request endpoint and required fields
if (check_origin()){  
  // Check request endpoint
  if(getRequestPath() === endpoint){  
    if(request_method === 'POST'){
      const event_data = JSON.parse(getRequestBody());
      
      // Check required fields
      if(event_data && Object.keys(event_data).length > 0) {
          const missingFields = [];

          const event_origin = event_data.event_origin;
          if(!event_origin) missingFields.push('event_origin');

          const event_date = event_data.event_date;
          if(!event_date) missingFields.push('event_date');
        
          const event_name = event_data.event_name;
          if(!event_name) missingFields.push('event_name');
  
          const event_timestamp = event_data.event_timestamp;
          if(!event_timestamp) missingFields.push('event_timestamp');
        
          const client_id = event_data.client_id;
          if(!client_id && event_origin == 'Measurement Protocol') missingFields.push('client_id');

          const session_id = event_data.session_id;
          if(!session_id && event_origin == 'Measurement Protocol') missingFields.push('session_id');
        
          const event_data_obj = event_data.event_data;
          if(!event_data_obj || event_data_obj == "{}") missingFields.push('event_data');
        
          if(event_data_obj && event_data_obj != "{}") {
            const page_id = event_data.event_data.page_id;
            if(!page_id) missingFields.push('page_id');
          
            const event_id = event_data.event_data.event_id;
            if(!event_id) missingFields.push('event_id');
          }
                
          var response_error;
        
          // Claim request
          if (user_cookie_name == session_cookie_name){
            if(data.enable_logs) {log("🔴 User cookie name and session cookie name can't be equal");}
            response_error = "🔴 User cookie name and session cookie name can't be equal";
          } else if (missingFields.length > 0 && event_name != 'get_user_data') {
            if(data.enable_logs) {log('🔴 Missing event parameters: ',  missingFields.join(', '));}
            response_error = '🔴 Missing event parameters: '.concat(missingFields.join(', '));
          } else if (event_name != 'get_user_data' && event_origin !== 'Website' && event_origin !== 'Measurement Protocol') {
            if(data.enable_logs) {log('🔴 Invalid event_origin parameter value. Accepted values: Website or Measurement Protocol');}
            response_error = '🔴 Invalid event_origin parameter value. Accepted values: Website or Measurement Protocol';
          } else if(event_name == 'get_user_data') {
            if(data.enable_logs){log('👉 Request from get_user_data event');}
            if(event_origin && event_origin == 'Website'){
              claim_request(get_user_data());
            } else {
              if(data.enable_logs) {log('🔴 Invalid event_origin parameter value. Accepted value: Website');}
              response_error = '🔴 Invalid event_origin parameter value. Accepted value: Website';
            } 
          } else {
            claim_request(build_hit_payload(event_data));
          }
      
          if(response_error) {
              setResponseStatus(500);
              setResponseHeader('Access-Control-Allow-Headers', 'application/json, x-api-key');
              setResponseHeader('Access-Control-Allow-Credentials', 'true');
              setResponseHeader('Access-Control-Allow-Origin', request_origin);
              setResponseBody(JSON.stringify({
                  status_code: 500,
                  response: response_error
              }));
      
              returnResponse();
          }
      } else {
        if(data.enable_logs){log('🔴 Empty or bad formatted request body');}
        setResponseStatus(500);
        setResponseHeader('Access-Control-Allow-Headers', 'application/json, x-api-key');
        setResponseHeader('Access-Control-Allow-Credentials', 'true');
        setResponseHeader('Access-Control-Allow-Origin', request_origin);
        setResponseBody(JSON.stringify({
          status_code: 500,
          response: '🔴 Empty or invalid request body'
        }));
        returnResponse();
      }
    }
  } else {
    if(data.enable_logs){log('🔴 The request endpoint is not correct');}
    setResponseStatus(500);
    setResponseHeader('Access-Control-Allow-Headers', 'application/json, x-api-key');
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
  setResponseHeader('Access-Control-Allow-Headers', 'application/json, x-api-key');
  setResponseHeader('Access-Control-Allow-Credentials', 'true');
  setResponseHeader('Access-Control-Allow-Origin', request_origin);
  setResponseBody(JSON.stringify({
    status_code: 500,
    response: '🔴 The request origin is not allowed'
  }));
  returnResponse();
}


function check_origin(){
  for(let i = 0; i < allowed_domains_list.length; i++){
    if(computeEffectiveTldPlusOne(request_origin) == computeEffectiveTldPlusOne(allowed_domains_list[i].allowed_domain)){
      return true;
    }
  }
}



// ------------------------------------------------------------------------------------------------------------------------------------------------------



// Build response for get user data request (For cross-domain only)
function get_user_data() { 
  const client_id = getCookieValues(user_cookie_name)[0] || 'undefined';
  const session_id = getCookieValues(session_cookie_name)[0] || 'undefined';
  const page_id = getCookieValues(session_cookie_name)[0].split('-')[1] || 'undefined';
  
  const event_data = {
    event_name: 'get_user_data',
    client_id: client_id,
    session_id: (session_id) ? session_id.split('-')[0] : null,
    page_id: page_id
  };
    
  return event_data;
}



// ------------------------------------------------------------------------------------------------------------------------------------------------------



// Build response for generic data
function build_hit_payload(event_data){
  // Measurement protocol
  if(event_data.event_origin == 'Measurement Protocol'){
    if(data.enable_logs){log('👉 Request from measurement protocol');}
    
    event_data.event_data.page_id = event_data.session_id + '-' + event_data.event_data.page_id;
    event_data.event_data.event_id = event_data.session_id + '-' + event_data.event_data.event_id;
    event_data.event_data.page_hostname = computeEffectiveTldPlusOne(request_origin);
    
    add_data_to_payload(event_data);
    
    return event_data; 
    
  // Website  
  } else if (event_data.event_origin == 'Website') {
    if(data.enable_logs){log('👉 Request from browser');}
    
    const page_id = event_data.event_data.page_id;
    const event_id = event_data.event_data.event_id;  
    const cross_domain_id = event_data.event_data.cross_domain_id;
    
    if (cross_domain_id) {
      const client_id = cross_domain_id.split('_')[0];
      const session_id = cross_domain_id;
                  
      event_data.client_id = client_id;
      event_data.session_id = session_id;
      event_data.event_data.page_id = session_id + '-' + page_id;
      event_data.event_data.event_id = session_id + '-' + event_id;
      
      if(data.enable_logs){log('👉 Cross-domain visit.');}
      if(data.enable_logs){log('👉 Create or overwrite user cookie: ', client_id, 'and session cookie: ', session_id);}
      
      set_user_cookie(user_cookie_name, client_id);
      set_session_cookie(session_cookie_name, event_data.event_data.page_id);
    
    // No cross domain
    } else {
      const user_cookie_value = getCookieValues(user_cookie_name)[0];
      const session_cookie_value = getCookieValues(session_cookie_name)[0];
          
      // New user
      if (user_cookie_value === undefined) {
        const new_client_id = event_data.temp_client_id || generate_alphanumeric();
        const new_session_id = event_data.temp_session_id || new_client_id + '_' + generate_alphanumeric();
        Object.delete(event_data, 'temp_client_id');
        Object.delete(event_data, 'temp_session_id');
          
        event_data.client_id = new_client_id;
        event_data.session_id = new_session_id;
        event_data.event_data.page_id = new_session_id + '-' + page_id;
        event_data.event_data.event_id = new_session_id + '-' + event_id;
        
        if(data.enable_logs){log('👉 New user, no active session. Create new user ID: ', new_client_id, ' and new session ID: ', new_session_id);}
        
        set_user_cookie(user_cookie_name, new_client_id);
        set_session_cookie(session_cookie_name, event_data.event_data.page_id);
      
      // Returning user
      } else if (user_cookie_value != undefined) {
        // No session cookie
        if (session_cookie_value === undefined){
          const old_client_id = user_cookie_value;
          const new_temp_session_id = (event_data.temp_session_id) ? event_data.temp_session_id.split('_')[1] : generate_alphanumeric();     
          const new_session_id = old_client_id + '_' + new_temp_session_id;          
          Object.delete(event_data, 'temp_client_id');
          Object.delete(event_data, 'temp_session_id');
          
          event_data.client_id = old_client_id;
          event_data.session_id = new_session_id;
          event_data.event_data.page_id = new_session_id + '-' + page_id;
          event_data.event_data.event_id = new_session_id + '-' + event_id;    
          
          if(data.enable_logs){log('👉 Returning user, no active session. Create new session ID: ', new_session_id);}
      
          set_user_cookie(user_cookie_name, old_client_id);
          set_session_cookie(session_cookie_name, event_data.event_data.page_id);
        // Yes session cookie
        } else {
          const old_client_id = user_cookie_value;
          const old_session_id = session_cookie_value.split('-')[0];
          Object.delete(event_data, 'temp_client_id');
          Object.delete(event_data, 'temp_session_id');
                  
          event_data.client_id = old_client_id;
          event_data.session_id = old_session_id;
          event_data.event_data.page_id = old_session_id + '-' + page_id;
          event_data.event_data.event_id = old_session_id + '-' + event_id;
          
          if(data.enable_logs){log('👉 Same user, same session. Extend cookies max-age.');}
  
          set_user_cookie(user_cookie_name, old_client_id);
          set_session_cookie(session_cookie_name, event_data.event_data.page_id);
        }
      }
    }
    
    add_data_to_payload(event_data);
        
    return event_data;
  }
} 


// Generate random alphanumeric ID 
function generate_alphanumeric() {
 var max_length = 15; // Change this to the desired length
 var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 var alphanumeric_id = '';
 for (var i = 0; i < max_length; i++) {
   alphanumeric_id += chars.charAt(generateRandom(0, chars.length));
 }
 return alphanumeric_id;
}


// Enhance payload data
function add_data_to_payload(event_data){
  // Add additional info    
  event_data.processing_event_timestamp = getTimestampMillis();
  event_data.content_length = makeNumber(getRequestHeader('content-length'));
  event_data.event_data.country = getRequestHeader('X-Appengine-Country');
  event_data.event_data.city = getRequestHeader('X-Appengine-City');
  event_data.event_data.ss_hostname = getRequestHeader('Host');
  event_data.event_data.ss_container_id = getContainerVersion().containerId;
  
  // Add event data from tag fields
  if (data.add_parameters) {
    const event_params = data.add_event_params;
    
    if (event_params !== undefined) {
      for (let i = 0; i < event_params.length; i++) {
        const param_name = event_params[i].param_name;
        const param_value = event_params[i].param_value;
        
        if (param_name !== 'event_id' && param_name !== 'page_id') {
          event_data.event_data[param_name] = param_value;
        }
      }
    }
  }
  
  // Remove event data from tag fields
  if (data.remove_parameters) {
    const event_params = data.remove_event_params;
    
    if (event_params !== undefined) {
      for (let i = 0; i < event_params.length; i++) {
        const param_name = event_params[i].param_name;
        
        if (param_name !== 'event_id' && param_name !== 'page_id') {
          Object.delete(event_data.event_data, param_name);
        }
      }
    }
  }
  
  // Override user ID
  if (data.override_user_id_parameter) {
    event_data.user_id = data.override_user_id_param;
  }
  
}



// ------------------------------------------------------------------------------------------------------------------------------------------------------



// Set user cookie
function set_user_cookie(cookie_name, cookie_value){  
  const cookie_domain = '.' + computeEffectiveTldPlusOne(request_origin);
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
  const cookie_domain = '.' + computeEffectiveTldPlusOne(request_origin);
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
  
  if (event_data.event_name == 'get_user_data') {
    if(data.enable_logs){log('SEND USER DATA BACK TO BROWSER...');}
    if(data.enable_logs){log('👉 Client ID:', event_data.client_id);}
    if(data.enable_logs){log('👉 Session ID:', event_data.session_id);}
    if(data.enable_logs){log('👉 Page ID:', event_data.page_id);}
    if(data.enable_logs){log('🟢 User data has been sent back correctly to the browser');}
  } else {
    if(data.enable_logs){log('SEND EVENT DATA TO GOOGLE BIGQUERY...');}    
    send_to_bq(event_data);
  }
}



// ------------------------------------------------------------------------------------------------------------------------------------------------------



// Send data to Google BigQuery
function send_to_bq(event_data){ 

  // Redact user_id, client_id, session_id from event_data 
  if (event_data.consent_data && event_data.consent_data.respect_consent_mode == 'No' && event_data.consent_data.tracking_anonimization == 'Yes' && event_data.consent_data.analytics_storage == 'Denied'){
    if (event_data.user_id){event_data.user_id = 'Redacted';}
    event_data.client_id = 'Redacted';
    event_data.session_id = 'Redacted' + '_' + 'Redacted';
    event_data.event_data.page_id = 'Redacted' + '_' + 'Redacted' + '-' + event_data.event_data.page_id.split('-')[1];
    event_data.event_data.event_id = 'Redacted' + '_' + 'Redacted' + '-' + event_data.event_data.event_id.split('-')[1];
  }
  
  const payload_copy = JSON.parse(JSON.stringify(event_data));
  
  if(data.enable_logs){log('👉 Payload to send: ', payload_copy);}
  
  // Encode data in GA4 style        
  encode_data(payload_copy, 'event_data');
  encode_data(payload_copy, 'consent_data');
  payload_copy.datalayer = (payload_copy.datalayer) ? JSON.stringify(payload_copy.datalayer) : payload_copy.datalayer;
  
  // Google BigQuery project settings
  const project = {
    projectId: data.bq_project_id,
    datasetId: data.bq_dataset_id,
    tableId: data.bq_table_id
  };
    
  // Write options
  const options = {
    skipInvalidRows: false,
    ignoreUnknownValues: false
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
function encode_data(bq_event_data, prop){
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
      // Is null or undefined
      } else if (getType(bq_event_data[prop][key]) == 'null' || getType(bq_event_data[prop][key]) == 'undefined'){
        temp_data.name = key;
        temp_data.value = null;
      // Is boolean
      } else if (getType(bq_event_data.consent_data[key]) == 'boolean'){
        temp_data.name = key;
        temp_data.value = {bool: bq_event_data[prop][key]};
    }
      mapped_data.push(temp_data);
    });
    bq_event_data[prop] = mapped_data;
  }
}