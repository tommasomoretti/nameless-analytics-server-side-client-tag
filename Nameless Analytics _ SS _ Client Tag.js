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
const generateRandom = require('generateRandom');
const getContainerVersion = require('getContainerVersion');
const getCookieValues = require('getCookieValues');
const setCookie = require ('setCookie');
const computeEffectiveTldPlusOne = require('computeEffectiveTldPlusOne');
const BigQuery = require('BigQuery');
const Firestore = require('Firestore');
const sendHttpRequest = require('sendHttpRequest');


// ------------------------------------------------------------------------------------------------------------------------------------------------------


const endpoint = data.endpoint;
const request_origin = getRequestHeader('Origin');
const request_method = getRequestMethod();
const authorized_domains_list = (data.add_authorized_domains) ? data.authorized_domains_list : [request_origin];
var authorized_domains = '';

const user_cookie_name = data.user_cookie_name || 'nameless_analytics_user';
const user_cookie_value = getCookieValues(user_cookie_name)[0];

const session_cookie_name = data.session_cookie_name || 'nameless_analytics_session';
const session_cookie_value = getCookieValues(session_cookie_name)[0];

if(data.enable_logs){log('NAMELESS ANALYTICS');}
if(data.enable_logs){log('CLIENT TAG CONFIGURATION');}

for(let i = 0; i < authorized_domains_list.length; i++){
  const authorized_domains_tld = computeEffectiveTldPlusOne(authorized_domains_list[i].authorized_domain);
  authorized_domains = authorized_domains.concat(', ', authorized_domains_tld);
} 
if(data.enable_logs){log('👉 Authorized origins:', (data.add_authorized_domains) ? authorized_domains.slice(2) : ' All');}
if(data.enable_logs){log('👉 Endpoint:', endpoint);}

// Check origin, request endpoint and required fields and claim requests
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
        if(!client_id && event_origin == 'Streaming protocol') missingFields.push('client_id');

        const session_id = event_data.session_id;
        if(!session_id && event_origin == 'Streaming protocol') missingFields.push('session_id');

        const user_data_obj = event_data.user_data;
        if(!user_data_obj || user_data_obj == "{}") missingFields.push('user_data');

        const session_data_obj = event_data.session_data;
        if(!session_data_obj || session_data_obj == "{}") missingFields.push('session_data');

        const event_data_obj = event_data.event_data;
        if(!event_data_obj || event_data_obj == "{}") missingFields.push('event_data');
        
        if(event_data_obj && event_data_obj != "{}") {
          const page_id = event_data.event_data.page_id;
          if(!page_id) missingFields.push('page_id');
          
          const event_id = event_data.event_id;
          if(!event_id) missingFields.push('event_id');
        }
                
        var response_error;
        
        // REJECT REQUESTS 
        // Check cookie name
        if (user_cookie_name == session_cookie_name){
          response_error = "🔴 User cookie name and session cookie name can't be equal";
          
        // Check required fields
        } else if (missingFields.length > 0 && event_name != 'get_user_data') {
          response_error = '🔴 Missing event parameters: '.concat(missingFields.join(', '));
          
        // Check event origin 
        } else if (event_origin !== 'Website' && event_origin !== 'Streaming protocol' && event_name != 'get_user_data') {
          response_error = '🔴 Invalid event_origin parameter value. Accepted values: Website or Streaming protocol';
                
        // CLAIM REQUESTS 
        // Claim requests for get_user_data
        } else if(event_name == 'get_user_data') {
          if(data.enable_logs){log('CLAIM REQUEST...');}
          if(data.enable_logs){log('👉 Request from get_user_data event');}
          
          if(event_origin && event_origin == 'Website'){
            claim_request(get_user_data());
          } else {
            response_error = '🔴 Invalid event_origin parameter value. Accepted value: Website';
            if(data.enable_logs) {log(response_error);}
          } 

        // Claim standard requests
        } else {
          if(data.enable_logs){log('CLAIM REQUEST...');}

          claim_request(add_data_to_payload(set_ids(event_data)));
        }
        
        // RETURN RESPONSE ERRORS
        if(response_error) {
          return_response_error(response_error);
        }
        
      } else {
        // RETURN RESPONSE ERRORS
        return_response_error('🔴 Empty or bad formatted request body');
      }
    }
  } else {
    // RETURN RESPONSE ERRORS
    return_response_error('🔴 The request endpoint is not correct');
  }
} else {
  // RETURN RESPONSE ERRORS
  return_response_error('🔴 The request origin is not authorized');
}


// Check request origin
function check_origin(){
  if (data.add_authorized_domains) {
    for(let i = 0; i < authorized_domains_list.length; i++){    
      if(computeEffectiveTldPlusOne(request_origin) == computeEffectiveTldPlusOne(authorized_domains_list[i].authorized_domain)){
        return true;
      }
    }
  } else {
    return true;
  }
}



// ------------------------------------------------------------------------------------------------------------------------------------------------------



// Build response for get_user_data requests (For cross-domain only)
function get_user_data() {   
  const client_id = user_cookie_value || 'undefined';
  const session_id = session_cookie_value || 'undefined';
  const page_id = (session_cookie_value) ? session_cookie_value.split('-')[1] : 'undefined';
  
  const event_data = {
    event_name: 'get_user_data',
    client_id: client_id,
    session_id: session_id.split('-')[0] || 'undefined',
    page_id: page_id
  };
    
  return event_data;
}



// ------------------------------------------------------------------------------------------------------------------------------------------------------



// Handle client id and session_id for standard requests
function set_ids(event_data){
  // Streaming protocol
  if(event_data.event_origin == 'Streaming protocol'){
    if(data.enable_logs){log('👉 Request from Streaming protocol');}
    if(data.enable_logs){log('👉 Event name: ', event_data.event_name);}
    
    event_data.event_data.page_id = event_data.session_id + '-' + event_data.event_data.page_id;
    event_data.event_id = event_data.session_id + '-' + event_data.event_id;
    event_data.event_data.page_hostname = computeEffectiveTldPlusOne(request_origin);
    
    add_data_to_payload(event_data);
    
    return event_data; 
    
  // Website  
  } else if (event_data.event_origin == 'Website') {
    if(data.enable_logs){log('👉 Request from website');}
    if(data.enable_logs){log('👉 Event name: ', event_data.event_name);}
    
    const page_id = event_data.event_data.page_id;
    const event_id = event_data.event_id;  
    const cross_domain_id = event_data.event_data.cross_domain_id;
    
    // Cross-domain request
    if (cross_domain_id) {
      const cross_domain_client_id = cross_domain_id.split('_')[0];
      const cross_domain_session_id = cross_domain_id;
      
      if(data.enable_logs){log('👉 Cross-domain visit.');}
      
      // With an active session
      if (session_cookie_value){
        // With different session id
        if (cross_domain_session_id != session_cookie_value.split('-')[0]) {       
          event_data.client_id = cross_domain_client_id;
          event_data.session_id = cross_domain_session_id;
          event_data.event_data.page_id = cross_domain_session_id + '-' + page_id;
          event_data.event_id = cross_domain_session_id + '-' + event_id;
       
          if(data.enable_logs){log('👉 Create new client_id: ', cross_domain_client_id + ' and new session_id: ', cross_domain_session_id);}
          
          // set_user_cookie(user_cookie_name, cross_domain_client_id);
          // set_session_cookie(session_cookie_name, event_data.event_data.page_id);
        
        // With the same session id   
        } else {   
          const old_client_id = user_cookie_value;
          const old_session_id = session_cookie_value.split('-')[0];
          
          event_data.client_id = old_client_id;
          event_data.session_id = old_session_id;
          event_data.event_data.page_id = old_session_id + '-' + page_id;
          event_data.event_id = old_session_id + '-' + event_id;
          
          if(data.enable_logs){log('👉 Same client_id, same session_id.');}
          if(data.enable_logs){log('👉 Extend cookies max-age.');}
          
          // set_user_cookie(user_cookie_name, old_client_id);
          // set_session_cookie(session_cookie_name, event_data.event_data.page_id);
        }
      // Without an active session         
      } else {
        event_data.client_id = cross_domain_client_id;
        event_data.session_id = cross_domain_session_id;
        event_data.event_data.page_id = cross_domain_session_id + '-' + page_id;
        event_data.event_id = cross_domain_session_id + '-' + event_id;
        
        if(data.enable_logs){log('👉 Returning user, no active session.');}
        if(data.enable_logs){log('👉 Same client_id: ', cross_domain_client_id + ', create new session_id: ', cross_domain_session_id);}
        
        // set_user_cookie(user_cookie_name, cross_domain_client_id);
        // set_session_cookie(session_cookie_name, event_data.event_data.page_id);
      }
      
    // No cross-domain request
    } else {          
      // New user
      if (user_cookie_value === undefined) {
        const new_client_id = generate_alphanumeric();
        const new_session_id = new_client_id + '_' + generate_alphanumeric();
          
        event_data.client_id = new_client_id;
        event_data.session_id = new_session_id;
        event_data.event_data.page_id = new_session_id + '-' + page_id;
        event_data.event_id = new_session_id + '-' + event_id;
        
        if(data.enable_logs){log('👉 New user, no active session.');}
        if(data.enable_logs){log('👉 Create new client_id: ', new_client_id + ' and new session_id: ', new_session_id);}
     
        // set_user_cookie(user_cookie_name, new_client_id);
        // set_session_cookie(session_cookie_name, event_data.event_data.page_id);
      
      // Returning user
      } else if (user_cookie_value != undefined) {
        // No session cookie
        if (session_cookie_value === undefined){
          const old_client_id = user_cookie_value;
          const new_session_id = old_client_id + '_' + generate_alphanumeric();          
          
          event_data.client_id = old_client_id;
          event_data.session_id = new_session_id;
          event_data.event_data.page_id = new_session_id + '-' + page_id;
          event_data.event_id = new_session_id + '-' + event_id;    
          
          if(data.enable_logs){log('👉 Returning user, no active session.');}
          if(data.enable_logs){log('👉 Same client_id: ', old_client_id + ', create new session_id: ', new_session_id);}
                                         
          // set_user_cookie(user_cookie_name, old_client_id);
          // set_session_cookie(session_cookie_name, event_data.event_data.page_id);
        // Yes session cookie
        } else {
          const old_client_id = user_cookie_value;
          const old_session_id = session_cookie_value.split('-')[0];
                  
          event_data.client_id = old_client_id;
          event_data.session_id = old_session_id;
          event_data.event_data.page_id = old_session_id + '-' + page_id;
          event_data.event_id = old_session_id + '-' + event_id;
          
          if(data.enable_logs){log('👉 Same client_id, same session_id.');}
          if(data.enable_logs){log('👉 Extend cookies max-age.');}
     
          // set_user_cookie(user_cookie_name, old_client_id);
          // set_session_cookie(session_cookie_name, event_data.event_data.page_id);
        }
      }
    }
            
    return event_data;
    
  }
} 



// ------------------------------------------------------------------------------------------------------------------------------------------------------



// Enhance payload data
function add_data_to_payload(event_data){
  // Add additional info    
  event_data.processing_event_timestamp = getTimestampMillis();
  event_data.content_length = makeNumber(getRequestHeader('content-length'));
  if(event_data.event_origin == 'Website' || event_data.event_origin == 'Streaming protocol') {
    event_data.event_data.country = getRequestHeader('X-Appengine-Country');
    event_data.event_data.city = getRequestHeader('X-Appengine-City');
  }
  event_data.event_data.ss_hostname = getRequestHeader('Host');
  event_data.event_data.ss_container_id = getContainerVersion().containerId;
  
  
  // User data
  // Add or override user ID
  if (data.override_user_id) {
    event_data.user_data.user_id = (data.user_id == "null")? null : data.user_id;
  }
  
  // Add user data from tag fields
  if (data.add_user_parameters) {
    const user_params = data.user_params_to_add;
    
    if (user_params !== undefined) {
      for (let i = 0; i < user_params.length; i++) {
        const param_name = user_params[i].param_name;
        const param_value = user_params[i].param_value;
        
        event_data.user_data[param_name] = param_value;
      }
    }
  }
  
  // Remove user data from tag fields
  if (data.remove_user_parameters) {
    const user_params = data.user_params_to_remove;
    
    if (user_params !== undefined) {
      for (let i = 0; i < user_params.length; i++) {
        const param_name = user_params[i].param_name;

        Object.delete(event_data.user_data, param_name);
      }
    }
  } 
  
  
  // Session data
    // Add session data from tag fields
  if (data.add_session_parameters) {
    const session_params = data.session_params_to_add;
    
    if (session_params !== undefined) {
      for (let i = 0; i < session_params.length; i++) {
        const param_name = session_params[i].param_name;
        const param_value = session_params[i].param_value;
        
        event_data.session_data[param_name] = param_value;
      }
    }
  }
  
  // Remove session data from tag fields
  if (data.remove_session_parameters) {
    const session_params = data.session_params_to_remove;
    
    if (session_params !== undefined) {
      for (let i = 0; i < session_params.length; i++) {
        const param_name = session_params[i].param_name;
        
        Object.delete(event_data.session_data, param_name);
      }
    }
  } 
  
  
  // Event data
  event_data.event_data.tld_source = (computeEffectiveTldPlusOne(event_data.event_data.source) !== '') ? computeEffectiveTldPlusOne(event_data.event_data.source) : event_data.event_data.source;  
  
  // Add event data from tag fields
  if (data.add_event_parameters) {
    const event_params = data.event_params_to_add;
    
    if (event_params !== undefined) {
      for (let i = 0; i < event_params.length; i++) {
        const param_name = event_params[i].param_name;
        const param_value = event_params[i].param_value;
        
        event_data.event_data[param_name] = param_value;
      }
    }
  }
  
  // Remove event data from tag fields
  if (data.remove_event_parameters) {
    const event_params = data.event_params_to_remove;
    
    if (event_params !== undefined) {
      for (let i = 0; i < event_params.length; i++) {
        const param_name = event_params[i].param_name;
        
        Object.delete(event_data.event_data, param_name);
      }
    }
  }  

  return event_data;
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



// ------------------------------------------------------------------------------------------------------------------------------------------------------



// Claim requests
function claim_request(event_data) {
  claimRequest();
    
  // Get user data requests
  if (event_data.event_name == 'get_user_data') {    
    return_response(event_data);
    
    if(data.enable_logs){log('SEND USER DATA BACK TO BROWSER...');}
    if(data.enable_logs){log('👉 Client ID:', event_data.client_id);}
    if(data.enable_logs){log('👉 Session ID:', event_data.session_id);}
    if(data.enable_logs){log('🟢 User data has been sent back correctly to the browser');}
     
  // Standard requests
  } else {
    // Send data to Firestore
    send_to_firestore(event_data)
    // Return response
    .then((res) => {
      if(res.status == true) {return_response(event_data);}
      else {return_response_error(res.response_error);}
      return res;
    })
    // Send data to BigQuery
    .then((res) => {
      if (res.status == true) {
        if (data.enable_logs) {log('SEND EVENT DATA TO GOOGLE BIGQUERY...');}
        send_to_bq(event_data);
      }
      return res;
    })
    // Send data to custom endpoint
    .then((res) => {
      if(res.status == true){
        if (data.send_data_to_custom_endpoint) {
          if (data.enable_logs) {log('SEND EVENT DATA TO CUSTOM ENDPOINT...');}
          send_to_custom_endpoint(data.custom_request_endpoint_path, event_data);
        }
      }
    });
  }
}


// Return response
function return_response(event_data) { 
  runContainer(event_data, () => {
    setResponseStatus(200);
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
    if(data.enable_logs){log('🟢 Request claimed succesfully');}
  });
}


// Return response error
function return_response_error(response_error){
  setResponseStatus(500);
  setResponseHeader('Access-Control-Allow-Credentials', 'true');
  setResponseHeader('Access-Control-Allow-Origin', request_origin);
  setResponseBody(JSON.stringify({
      status_code: 500,
      response: response_error
  }));
  
  returnResponse();
  if(data.enable_logs){log(response_error);}
}



// ------------------------------------------------------------------------------------------------------------------------------------------------------



// Send data to Google Firestore
function send_to_firestore(event_data) {
  const projectId = data.bq_project_id;
  const queries = [['client_id', '==', event_data.client_id]];
  const collection_path = 'users';
  const document_path = collection_path + '/' + event_data.client_id;
  
  return Firestore.query(collection_path, queries, {projectId: projectId, limit: 1})
  .then((documents) => {
    
    let response_error = ''; 
    
    // REJECT REQUESTS (orphan events) 
    if(event_data.event_origin == 'Website' && event_data.event_name != 'page_view' && event_data.event_name != 'get_user_data' && user_cookie_value == undefined) {
      response_error = '🔴 Website orphan event. Trigger a page_view event first to create a new user and a new session.';
      return {status: false, response_error: response_error};
    } else if (event_data.event_origin == 'Website' && event_data.event_name != 'page_view' && event_data.event_name != 'get_user_data' && session_cookie_value == undefined) {
      response_error = '🔴 Website orphan event. Trigger a page_view event first to create a new session.';
      return {status: false, response_error: response_error};
    } else if (event_data.event_origin == 'Streaming protocol' && documents.length === 0) {
      response_error = '🔴 Streaming protocol orphan event. Trigger a page_view event from website first to create a new user and a new session.';
      return {status: false, response_error: response_error};
    } else if (event_data.event_origin == 'Streaming protocol' && event_data.session_id != documents[0].data.sessions.slice(-1)[0].session_id) {
      response_error = '🔴 Streaming protocol orphan event. Trigger a page_view event from website first to create a new session.';
      return {status: false, response_error: response_error};
    } 
    
    // Set cookies
    set_user_cookie(user_cookie_name, event_data.client_id);
    set_session_cookie(session_cookie_name, event_data.event_data.page_id);
  
    // Create user_data and session_data if not exist 
    if (!event_data.user_data) {event_data.user_data = {};}
    if (!event_data.session_data) {event_data.session_data = {};}
        
    // If user does not exist in Firestore
    if (documents && documents.length === 0) {
      if(data.enable_logs){log('SEND EVENT DATA TO GOOGLE FIRESTORE...');}          
      if(data.enable_logs){log('👉 User does not exist');}
      if(data.enable_logs){log('👉 Session does not exist');}
      
      // Set user and session parameter values for Firestore from current event data
      const firestore_data = {
        user_date: event_data.event_date,
        client_id: event_data.client_id,
        user_channel_grouping: event_data.event_data.channel_grouping,
        user_source: event_data.event_data.source,
        user_tld_source: event_data.event_data.tld_source,
        user_campaign: event_data.event_data.campaign,
        user_campaign_id: event_data.event_data.campaign_id,
        user_device_type: event_data.event_data.device_type,
        user_country: event_data.event_data.country,
        user_language: event_data.event_data.browser_language,
        user_first_session_timestamp: (event_data.event_name == 'page_view') ? event_data.event_timestamp : 'null',
        user_last_session_timestamp: (event_data.event_name == 'page_view') ? event_data.event_timestamp : 'null',
        sessions: [{
          session_date: event_data.event_date,
          session_id: event_data.session_id,
          session_number: 1,
          cross_domain_session: (event_data.event_data.cross_domain_id) ? 'Yes' : 'No',
          session_channel_grouping: event_data.event_data.channel_grouping,
          session_source: event_data.event_data.source,
          session_tld_source: event_data.event_data.tld_source,           
          session_campaign: event_data.event_data.campaign,
          session_campaign_content: event_data.event_data.campaign_content,
          session_campaign_id: event_data.event_data.campaign_id,
          session_campaign_term: event_data.event_data.campaign_term,
          session_device_type: event_data.event_data.device_type,
          session_country: event_data.event_data.country,
          session_language: event_data.event_data.browser_language,
          session_hostname: event_data.event_data.page_hostname,
          session_browser_name: event_data.event_data.browser_name,
          session_landing_page_category: event_data.event_data.page_category,            
          session_landing_page_location: event_data.event_data.page_location,
          session_landing_page_title: event_data.event_data.page_title,
          session_exit_page_category: event_data.event_data.page_category,
          session_exit_page_location: event_data.event_data.page_location,
          session_exit_page_title: event_data.event_data.page_title,
          session_start_timestamp: (event_data.event_name == 'page_view') ? event_data.event_timestamp : 'null',
          session_end_timestamp: event_data.event_timestamp,
        }]
      };
        
      // Add user parameters to Firestore
      for (let key in event_data.user_data) {
        if (event_data.user_data.hasOwnProperty(key)) {
          firestore_data[key] = event_data.user_data[key];
        }
      }
        
      // Add session parameters to Firestore
      for (let key in event_data.session_data) {
        if (event_data.session_data.hasOwnProperty(key)) {
          firestore_data.sessions[0][key] = event_data.session_data[key];
        }
      }
        
      // Send data to Firestore 
      if(data.enable_logs){log('👉 Payload to send: ', firestore_data);}

      Firestore.write(document_path, firestore_data, {projectId: projectId, merge: true})
        .then(() => {
          if(data.enable_logs){log('🟢 User successfully created in Firestore, session successfully added into Firestore');}
        });
      
      // Add user parameters to Big Query        
      for (let key in firestore_data) {
        if (firestore_data.hasOwnProperty(key) && key !== 'sessions') {
          event_data.user_data[key] = firestore_data[key];
        }
      }
      
      Object.delete(event_data.user_data, 'client_id');
            
      // Add session parameters to Big Query 
      event_data.session_data = firestore_data.sessions[0];

      Object.delete(event_data.session_data, 'session_id');

    // If user exists in Firestore  
    } else {
      if(data.enable_logs){log('SEND EVENT DATA TO GOOGLE FIRESTORE...');}          
      if(data.enable_logs){log('👉 User exist');}
      
      const firestore_data = documents[0].data;  
      const sessions_data = firestore_data.sessions;
      const last_session = sessions_data.slice(-1)[0];
                
      // Update user values in Firestore from current user data if not already exists or has a not null value        
      const protected_keys = [
        "user_date", 
        "user_channel_grouping", 
        "user_source", 
        "user_tld_source", 
        "user_campaign", 
        "user_campaign_id", 
        "user_device_type", 
        "user_country", 
        "user_language",
        "user_first_session_timestamp",
        "user_last_session_timestamp"
      ];
        
      Object.keys(event_data.user_data).forEach(function(key) {
        const value = event_data.user_data[key];
          
        if (value == null) {return;}
        if (protected_keys.indexOf(key) !== -1 && firestore_data[key] != null) {return;}
        
        if (firestore_data[key] !== value) {
          firestore_data[key] = value;
        }
      });
      
      // Update last session timestamp of the user
      if(event_data.session_id != last_session.session_id) {
        firestore_data.user_last_session_timestamp = event_data.event_timestamp;
      }
      
      // Add user parameters to Big Query        
      for (let key in firestore_data) {
        if (firestore_data.hasOwnProperty(key) && key !== 'sessions') {
          event_data.user_data[key] = firestore_data[key];
        }
      }
      
      Object.delete(event_data.user_data, 'client_id');
                       
      // If session doesn't exists in Firestore
      if (event_data.session_id != last_session.session_id) {  
        if(data.enable_logs){log('👉 Session does not exist');}
          
        // Set new session values for Firestore from current event data
        var new_session = {
          session_date: event_data.event_date,
          session_id: event_data.session_id,
          session_number: last_session.session_number + 1,
          cross_domain_session: (event_data.event_data.cross_domain_id) ? 'Yes' : 'No',
          session_channel_grouping: event_data.event_data.channel_grouping,
          session_source: event_data.event_data.source,
          session_tld_source: event_data.event_data.tld_source,
          session_campaign: event_data.event_data.campaign,
          session_campaign_content: event_data.event_data.campaign_content,
          session_campaign_id: event_data.event_data.campaign_id,
          session_campaign_term: event_data.event_data.campaign_term,
          session_device_type: event_data.event_data.device_type,
          session_country: event_data.event_data.country,
          session_language: event_data.event_data.browser_language,
          session_hostname: event_data.event_data.page_hostname,
          session_browser_name: event_data.event_data.browser_name,
          session_landing_page_category: (event_data.event_data.page_category) ? event_data.event_data.page_category : null,
          session_landing_page_location: event_data.event_data.page_location,
          session_landing_page_title: event_data.event_data.page_title,
          session_exit_page_category: (event_data.event_data.page_category) ? event_data.event_data.page_category : null,          
          session_exit_page_location: event_data.event_data.page_location,
          session_exit_page_title: event_data.event_data.page_title,
          session_start_timestamp: (event_data.event_name == 'page_view') ? event_data.event_timestamp : 'null',
          session_end_timestamp: event_data.event_timestamp
        };
          
        // Add session parameters for Firestore
        for (let key in event_data.session_data) {
          if (event_data.session_data.hasOwnProperty(key)) {
            new_session[key] = event_data.session_data[key];
          }
        }
          
        // Add new session data to Firestore
        firestore_data.sessions.push(new_session);
        
        // Send data to Firestore                    
        if(data.enable_logs){log('👉 Payload to send: ', firestore_data);}

        Firestore.write(document_path, firestore_data, {projectId: projectId, merge: true})
          .then(() => {
            if(data.enable_logs){log('🟢 User already in Firestore, session successfully added into Firestore');}
          });

        // Add data to BigQuery
        event_data.session_data = firestore_data.sessions.slice(-1)[0];
        Object.delete(event_data.session_data, 'session_id');
        
      // If session exists in Firestore        
      } else {
        if(data.enable_logs){log('👉 Session exist');}       

        // Update session values in Firestore from current session data if not already exists or has a not null value 
        const protected_keys = [
          "session_date", 
          "session_number", 
          "cross_domain_session", 
          "session_channel_grouping", 
          "session_source", 
          "session_tld_source", 
          "session_campaign", 
          "session_campaign_content", 
          "session_campaign_id", 
          "session_campaign_term", 
          "session_device_type", 
          "session_country", 
          "session_language", 
          "session_hostname", 
          "session_browser_name", 
          "session_landing_page_category", 
          "session_landing_page_location", 
          "session_landing_page_title", 
          "session_exit_page_category", 
          "session_exit_page_location", 
          "session_exit_page_title", 
          "session_start_timestamp", 
          "session_end_timestamp"
        ];
        
        Object.keys(event_data.session_data).forEach(function(key) {
          const value = event_data.session_data[key];
          
          if (value == null) {return;}
          if (protected_keys.indexOf(key) !== -1 && last_session[key] != null) {return;}
        
          if (firestore_data[key] !== value) {
            last_session[key] = value;
          }
        });
            
        // Update session values in Firestore from current event data
        last_session.session_exit_page_category = (event_data.event_data.page_category) ? event_data.event_data.page_category : null;
        last_session.session_exit_page_location = event_data.event_data.page_location;
        last_session.session_exit_page_title = event_data.event_data.page_title;
        last_session.session_end_timestamp = event_data.event_timestamp;
        if(last_session.cross_domain_session == 'No'){last_session.cross_domain_session = (event_data.event_data.cross_domain_id) ? 'Yes' : 'No';}
                
        // Send data to firestore                    
        if(data.enable_logs){log('👉 Payload to send: ', firestore_data);}
        
        Firestore.write(document_path, firestore_data, {projectId: projectId, merge: true})
          .then(() => {
            if(data.enable_logs){log('🟢 User already in Firestore, session successfully updated into Firestore');}
          });
        
        // Add data for BigQuery
        event_data.session_data = last_session;
        Object.delete(event_data.session_data, 'session_id');
      }        
    }
    
    return {status: true};
  });
}



// ------------------------------------------------------------------------------------------------------------------------------------------------------



// Send data to Google BigQuery
function send_to_bq(event_data){
  const payload_copy = JSON.parse(JSON.stringify(event_data));
  
  if(data.enable_logs){log('👉 Payload to send: ', payload_copy);}
  
  // Encode data for Google BigQuery        
  encode_data(payload_copy, 'user_data');
  encode_data(payload_copy, 'session_data');
  encode_data(payload_copy, 'event_data');
  encode_data(payload_copy, 'consent_data');
  
  payload_copy.datalayer = (payload_copy.datalayer) ? JSON.stringify(payload_copy.datalayer) : null;
  payload_copy.ecommerce = (payload_copy.ecommerce) ? JSON.stringify(payload_copy.ecommerce) : null;
  
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
    () => {if(data.enable_logs){log('🟢 Payload data inserted successfully into BigQuery');}},
    () => {if(data.enable_logs){log('🔴 Payload data not inserted into BigQuery');}}
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
      } else if (getType(bq_event_data[prop][key]) == 'object' || getType(bq_event_data[prop][key]) == 'array') {
        temp_data.name = key;
        temp_data.value = {json: JSON.stringify(bq_event_data[prop][key])};
                
      // Is null or undefined
      } else if (getType(bq_event_data[prop][key]) == 'null' || getType(bq_event_data[prop][key]) == 'undefined'){
        temp_data.name = key;
        temp_data.value = null;
      // Is boolean        
      } else if (getType(bq_event_data[prop][key]) == 'boolean'){
        temp_data.name = key;
        temp_data.value = {bool: bq_event_data[prop][key]};
      }
      mapped_data.push(temp_data);
    });
    bq_event_data[prop] = mapped_data;
  }
}



// ------------------------------------------------------------------------------------------------------------------------------------------------------



// Send data to custom endpoint 
function send_to_custom_endpoint(custom_request_endpoint_path, event_data) {
  if(data.enable_logs){log('👉 Payload to send: ', event_data);}
  
  const request_options = {
    method: 'POST',
    headers: {}
  };
  
  if (data.add_custom_request_headers) {
    const custom_request_headers = data.custom_request_headers;
    
    if (custom_request_headers !== undefined) {
      for (let i = 0; i < custom_request_headers.length; i++) {
        const header_name = custom_request_headers[i].header_name;
        const header_value = custom_request_headers[i].header_value;
        
        request_options.headers[header_name] = header_value;
      }
    }
  }
  
  sendHttpRequest(custom_request_endpoint_path, request_options, JSON.stringify(event_data))
    .then((result) => {
      if (result.statusCode >= 200 && result.statusCode < 300) {
        if(data.enable_logs){log('🟢 Request send succesfully to:', custom_request_endpoint_path);}
      } else {
        if(data.enable_logs){log('🔴 Request do not send succesfully. Error:', result);}      
      }
    });
}



// ------------------------------------------------------------------------------------------------------------------------------------------------------



// Set user cookie
function set_user_cookie(cookie_name, cookie_value){  
  const cookie_domain = '.' + computeEffectiveTldPlusOne(request_origin);
  const cookie_path = '/';
  const cookie_secure = true;
  const sameSite = "Lax";
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
  const sameSite = "Lax";
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