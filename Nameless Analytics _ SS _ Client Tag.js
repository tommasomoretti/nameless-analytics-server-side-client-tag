const log = require('logToConsole');
const getTimestampMillis = require('getTimestampMillis');
const claimRequest = require('claimRequest');
const getRequestHeader = require('getRequestHeader');
const getRemoteAddress = require('getRemoteAddress');
const getRequestBody = require('getRequestBody');
const getRequestMethod = require('getRequestMethod');
const getRequestPath = require('getRequestPath');
const getClientName = require('getClientName');
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
const setCookie = require('setCookie');
const computeEffectiveTldPlusOne = require('computeEffectiveTldPlusOne');
const BigQuery = require('BigQuery');
const Firestore = require('Firestore');
const sendHttpRequest = require('sendHttpRequest');


// ------------------------------------------------------------------------------------------------------------------------------------------------------


// Request data
const endpoint = data.endpoint;
const request_origin = getRequestHeader('Origin');
const request_ip = getRemoteAddress();
const request_method = getRequestMethod();

// Event data
const event_data = JSON.parse(getRequestBody());
const page_date = event_data.page_date;
const page_id = event_data.page_id;
const page_data_obj = event_data.page_data;
const event_origin = event_data.event_origin;
const event_date = event_data.event_date;
const event_timestamp = event_data.event_timestamp;
const event_name = event_data.event_name;
const event_id = event_data.event_id;
const event_data_obj = event_data.event_data;

const event_api_key = getRequestHeader('x-api-key'); // For Streaming protocol 
const api_key = data.api_key; // For Streaming protocol

// Cookie data
const user_cookie_name = (data.change_cookie_prefix) ? data.cookie_prefix + '_na_u' : 'na_u';
const user_cookie_value = getCookieValues(user_cookie_name)[0];

const session_cookie_name = (data.change_cookie_prefix) ? data.cookie_prefix + '_na_s' : 'na_s';
const session_cookie_value = getCookieValues(session_cookie_name)[0];

// Response data
var message;
var status_code;


// Check request endpoint
if (getRequestPath() === endpoint) {
  if (data.enable_logs) { log('NAMELESS ANALYTICS'); }
  if (data.enable_logs) { log('CLIENT TAG CONFIGURATION'); }

  // Check request origin, required fields and claim requests
  if (check_origin()) {
    if (!check_ip()) {

      if (data.enable_logs) { log('CHECK REQUEST'); }

      if (event_name == 'get_user_data') {
        if (data.enable_logs) { log('👉 Request type: Get user data'); }
      } else {
        if (data.enable_logs) { log('👉 Request type:', event_origin); }
      }

      if (data.enable_logs) { log('👉 Event name: ', event_data.event_name); }

      if (request_method === 'POST') {
        let message;
        let status_code;

        // Check required fields
        const missing_fields = [];

        if (!page_date) missing_fields.push('page_date');
        if (!page_id) missing_fields.push('page_id');
        if (!page_data_obj || Object.keys(page_data_obj).length === 0) missing_fields.push('page_data');

        if (!event_origin) missing_fields.push('event_origin');
        if (!event_date) missing_fields.push('event_date');
        if (!event_timestamp) missing_fields.push('event_timestamp');
        if (!event_name) missing_fields.push('event_name');
        if (!event_id) missing_fields.push('event_id');
        if (!event_data_obj || Object.keys(event_data_obj).length === 0) missing_fields.push('event_data');

        // REFUSE REQUESTS
        // Check request for get_user_data
        if (event_name == 'get_user_data' && event_origin != 'Website' && event_name != 'Streaming protocol') {
          message = '🔴 Invalid event_origin parameter value. Accepted values: Website';
          status_code = 403;

          if (data.enable_logs) { log(message); }
          claim_request({ event_name: event_name }, status_code, message);
          return;
        }

        // Check if user or session cookie is missing for get_user_data requests
        if (event_name == 'get_user_data' && (user_cookie_value === undefined || session_cookie_value === undefined)) {
          if (data.enable_logs) { log('👉 Request from get_user_data event'); }

          if (data.enable_logs) { log('CHECK COOKIES'); }

          if (user_cookie_value === undefined) {
            message = '🔴 User cookie not found. No cross-domain link decoration will be applied';
            status_code = 403;

            if (data.enable_logs) { log(message); }
            claim_request(set_ids_get_user_data(), status_code, message);
            return;
          } else if (session_cookie_value === undefined) {
            message = '🔴 Session cookie not found. No cross-domain link decoration will be applied';
            status_code = 403;

            if (data.enable_logs) { log(message); }
            claim_request(set_ids_get_user_data(), status_code, message);
            return;
          }
        }

        // Check event origin 
        if (event_origin !== 'Website' && event_origin !== 'Streaming protocol' && event_name != 'get_user_data') {
          message = '🔴 Invalid event_origin parameter value. Accepted values: Website or Streaming protocol';
          status_code = 403;

          if (data.enable_logs) { log(message); }
          claim_request({ event_name: event_name }, status_code, message);
          return;
        }

        // Check User-Agent header
        const user_agent = getRequestHeader('User-Agent') || '';
        const request_user_agent = user_agent.toLowerCase();
        const bad_agents = ["curl", "wget", "python", "requests", "httpie", "go-http-client", "java", "okhttp", "libwww", "perl", "axios", "node", "fetch", "bot", "crawler", "spider", "scraper", "headless", "phantomjs", "selenium", "puppeteer", "playwright"];

        if (request_user_agent === '' || request_user_agent === null) {
          message = '🔴 Missing User-Agent header. Request from bot';
          status_code = 403;

          if (data.enable_logs) { log(message); }
          claim_request({ event_name: event_name }, status_code, message);
          return;
        }

        if (event_origin == 'Streaming protocol' && request_user_agent != 'nameless analytics - streaming protocol') {
          message = '🔴 Invalid User-Agent header value. Request from bot';
          if (data.enable_logs) { log(message); }
          status_code = 403;

          claim_request({ event_name: event_name }, status_code, message);
          return;
        }

        for (var i = 0; i < bad_agents.length; i++) {
          if (request_user_agent.indexOf(bad_agents[i]) !== -1) {
            message = '🔴 Invalid User-Agent header value. Request from bot';
            status_code = 403;
            if (data.enable_logs) { log(message); }

            claim_request({ event_name: event_name }, status_code, message);
            return;
          }
        }

        // Check Streaming protocol requests API key
        if (event_origin == 'Streaming protocol' && data.add_api_key && event_api_key != api_key) {
          message = '🔴 Invalid API key';
          if (data.enable_logs) { log(message); }
          status_code = 403;

          claim_request({ event_name: event_name }, status_code, message);
          return;
        }

        // Check if page_view is from Streaming protocol
        if (event_name == 'page_view' && event_origin == 'Streaming protocol') {
          message = '🔴 Invalid event_name. Can\'t send page_view from Streaming protocol';
          status_code = 403;

          if (data.enable_logs) { log(message); }
          claim_request({ event_name: event_name }, status_code, message);
          return;
        }

        // Check if some required parameter is missing 
        if (event_name != 'get_user_data' && missing_fields.length > 0) {
          message = '🔴 Missing required parameters: '.concat(missing_fields.join(', '));
          if (data.enable_logs) { log(message); }
          status_code = 403;

          claim_request({ event_name: event_name }, status_code, message);
          return;
        }

        // Check if user cookie is missing
        if (event_origin == 'Website' && event_data.event_name != 'page_view' && event_data.event_name != 'get_user_data' && user_cookie_value === undefined) {
          message = '🔴 Orphan event: missing user cookie. Trigger a page_view event first to create a new user and a new session';
          status_code = 403;

          if (data.enable_logs) { log(message); }
          claim_request({ event_name: event_name }, status_code, message);
          return;
        }

        // Check if session cookie is missing
        if (event_origin == 'Website' && event_data.event_name != 'page_view' && event_data.event_name != 'get_user_data' && session_cookie_value === undefined) {
          message = '🔴 Orphan event: missing session cookie. Trigger a page_view event first to create a new session';
          status_code = 403;

          if (data.enable_logs) { log(message); }
          claim_request({ event_name: event_name }, status_code, message);
          return;
        }

        // CLAIM REQUESTS 
        // Claim get user data requests
        if (event_name == 'get_user_data') {
          if (data.enable_logs) { log('🟢 Request correct, user and session cookie found. Cross-domain link decoration will be applied'); }

          message = '🟢 Request claimed successfully';
          status_code = 200;

          if (data.enable_logs) { log('REQUEST STATUS'); }
          claim_request(set_ids_get_user_data(), status_code, message);
          return;
        } else {
          // Claim standard requests
          if (data.enable_logs) { log('🟢 Request correct'); }

          claim_request(build_payload(set_ids(event_data)), null, '');
          return;
        }

      } else {
        if (data.enable_logs) { log('CHECK REQUEST'); }

        // RETURN RESPONSE ERRORS
        message = '🔴 Request method not correct';
        status_code = 403;

        if (data.enable_logs) { log(message); }
        claim_request({ event_name: event_name }, status_code, message);
        return;
      }
    } else {
      if (data.enable_logs) { log('CHECK REQUEST'); }

      // RETURN RESPONSE ERRORS
      message = '🔴 Request IP not authorized';
      status_code = 403;

      if (data.enable_logs) { log(message); }
      claim_request({ event_name: event_name }, status_code, message);
      return;
    }
  } else {
    if (data.enable_logs) { log('CHECK REQUEST'); }

    // RETURN RESPONSE ERRORS
    message = '🔴 Request origin not authorized';
    status_code = 403;

    if (data.enable_logs) { log(message); }
    claim_request({ event_name: event_name }, status_code, message);
    return;
  }
}


// Check request origin
function check_origin() {
  const authorized_domains_list = (data.add_authorized_domains) ? data.authorized_domains_list : [{ authorized_domain: request_origin }];
  var authorized_domains = '';

  for (let i = 0; i < authorized_domains_list.length; i++) {
    const authorized_domains_tld = computeEffectiveTldPlusOne(authorized_domains_list[i].authorized_domain);
    authorized_domains = authorized_domains.concat(', ', authorized_domains_tld);
  }

  if (data.enable_logs) { log('👉 Endpoint:', endpoint); }
  if (data.enable_logs) { log('👉 Authorized origins:', (data.add_authorized_domains) ? authorized_domains.slice(2) : ' All'); }

  for (let i = 0; i < authorized_domains_list.length; i++) {
    if (computeEffectiveTldPlusOne(request_origin) == computeEffectiveTldPlusOne(authorized_domains_list[i].authorized_domain)) {
      return true;
    }
  }
}


// Check request ip
function check_ip() {
  const banned_ip_list = (data.add_banned_ips) ? data.banned_ips_list : [{ banned_ip: null }];
  var banned_ips = '';

  for (let i = 0; i < banned_ip_list.length; i++) {
    banned_ips = banned_ips.concat(', ', banned_ip_list[i].banned_ip);
  }

  if (data.enable_logs) { log('👉 Unauthorized IPs:', (data.add_banned_ips) ? banned_ips.slice(2) : 'None'); }

  for (let i = 0; i < banned_ip_list.length; i++) {
    if (request_ip == banned_ip_list[i].banned_ip) {
      return true;
    }
  }
}


// ------------------------------------------------------------------------------------------------------------------------------------------------------


// Handle ids for get_user_data requests (For cross-domain only)
function set_ids_get_user_data() {
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


// Handle ids for standard requests
function set_ids(event_data) {
  const page_id = event_data.page_id;
  const event_id = event_data.event_id;
  const cross_domain_id = event_data.event_data.cross_domain_id;

  // Cross-domain request
  if (event_origin == 'Website' && cross_domain_id) {
    const cross_domain_client_id = cross_domain_id.split('_')[0];
    const cross_domain_session_id = cross_domain_id;

    if (data.enable_logs) { log('👉 Cross-domain visit'); }

    // With an active session
    if (session_cookie_value) {
      // With different session id
      if (cross_domain_session_id != session_cookie_value.split('-')[0]) {
        event_data.client_id = cross_domain_client_id;
        event_data.session_id = cross_domain_session_id;
        event_data.page_id = cross_domain_session_id + '-' + page_id;
        event_data.event_id = cross_domain_session_id + '-' + event_id;

        if (data.enable_logs) { log('👉 Create new client_id: ', cross_domain_client_id + ' and new session_id: ', cross_domain_session_id); }

        // With the same session id   
      } else {
        const old_client_id = user_cookie_value;
        const old_session_id = session_cookie_value.split('-')[0];

        event_data.client_id = old_client_id;
        event_data.session_id = old_session_id;
        event_data.page_id = old_session_id + '-' + page_id;
        event_data.event_id = old_session_id + '-' + event_id;

        if (data.enable_logs) { log('CHECK USER AND SESSION COOKIES'); }
        if (data.enable_logs) { log('👉 Same client_id, same session_id'); }
        if (data.enable_logs) { log('👉 Extend cookies max-age'); }
      }

      // Without an active session         
    } else {
      event_data.client_id = cross_domain_client_id;
      event_data.session_id = cross_domain_session_id;
      event_data.page_id = cross_domain_session_id + '-' + page_id;
      event_data.event_id = cross_domain_session_id + '-' + event_id;

      if (data.enable_logs) { log('CHECK USER AND SESSION COOKIES'); }
      if (data.enable_logs) { log('👉 Returning user, no active session'); }
      if (data.enable_logs) { log('👉 Same client_id: ', cross_domain_client_id + ', create new session_id: ', cross_domain_session_id); }
    }

    // No cross-domain request
  } else {
    // New user
    if (user_cookie_value === undefined) {
      const new_client_id = generate_alphanumeric();
      const new_session_id = new_client_id + '_' + generate_alphanumeric();

      event_data.client_id = new_client_id;
      event_data.session_id = new_session_id;
      event_data.page_id = new_session_id + '-' + page_id;
      event_data.event_id = new_session_id + '-' + event_id;

      if (data.enable_logs) { log('CHECK USER AND SESSION COOKIES'); }
      if (data.enable_logs) { log('👉 New user, no active session'); }
      if (data.enable_logs) { log('👉 Create new client_id: ', new_client_id + ' and new session_id: ', new_session_id); }

      // Returning user
    } else if (user_cookie_value != undefined) {
      // No session cookie
      if (session_cookie_value === undefined) {
        const old_client_id = user_cookie_value;
        const new_session_id = old_client_id + '_' + generate_alphanumeric();

        event_data.client_id = old_client_id;
        event_data.session_id = new_session_id;
        event_data.page_id = new_session_id + '-' + page_id;
        event_data.event_id = new_session_id + '-' + event_id;

        if (data.enable_logs) { log('CHECK USER AND SESSION COOKIES'); }
        if (data.enable_logs) { log('👉 Returning user, no active session'); }
        if (data.enable_logs) { log('👉 Same client_id: ', old_client_id + ', create new session_id: ', new_session_id); }

        // Yes session cookie
      } else {
        const old_client_id = user_cookie_value;
        const old_session_id = session_cookie_value.split('-')[0];

        event_data.client_id = old_client_id;
        event_data.session_id = old_session_id;
        event_data.page_id = old_session_id + '-' + page_id;
        event_data.event_id = old_session_id + '-' + event_id;

        if (data.enable_logs) { log('CHECK USER AND SESSION COOKIES'); }
        if (data.enable_logs) { log('👉 Same client_id, same session_id'); }
        if (data.enable_logs) { log('👉 Extend cookies max-age'); }
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


// Build payload data for standard requests
function build_payload(event_data) {
  // Add additional info    

  // When hosting GTM Server-side on Cloud Run, follow this guide to correctly configure geolocation headers: https://www.simoahava.com/analytics/cloud-run-server-side-tagging-google-tag-manager/#add-geolocation-headers-to-the-traffic

  event_data.event_data.country = getRequestHeader('X-Appengine-Country') || getRequestHeader('X-Gclb-Country');
  event_data.event_data.city = getRequestHeader('X-Appengine-City') || getRequestHeader('X-Gclb-Region');

  event_data.gtm_data.ss_hostname = getRequestHeader('Host');
  event_data.gtm_data.ss_container_id = getContainerVersion().containerId;
  event_data.gtm_data.ss_tag_name = getClientName();
  event_data.gtm_data.ss_tag_id = null;
  event_data.gtm_data.processing_event_timestamp = getTimestampMillis();
  event_data.gtm_data.content_length = makeNumber(getRequestHeader('content-length'));

  // User data
  // Add or override user ID
  if (data.override_user_id) {
    event_data.session_data.user_id = (data.user_id == "null") ? null : data.user_id;
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
  if (event_data.event_data.source) {
    event_data.event_data.tld_source = (computeEffectiveTldPlusOne(event_data.event_data.source) !== '') ? computeEffectiveTldPlusOne(event_data.event_data.source) : event_data.event_data.source;
  }

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


// ------------------------------------------------------------------------------------------------------------------------------------------------------


// Claim requests
function claim_request(event_data, status_code, message) {
  claimRequest();

  // For error requests and get_user_data requests
  if ((status_code === 403 || event_data.event_name == 'get_user_data')) {
    if (data.enable_logs) { log('REQUEST STATUS'); }
    return_response(event_data, status_code, message);

    // For standard requests
  } else {
    // Send data to Firestore
    if (data.enable_logs) { log('SEND EVENT DATA TO GOOGLE FIRESTORE'); }
    send_to_firestore(event_data)
      // Return response to browser
      .then((res) => {
        if (data.enable_logs) { log('REQUEST STATUS'); }

        if (data.enable_logs) { log(res.message); }
        return_response(event_data, res.status_code, res.message);
        return res;
      })
      // Send data to BigQuery
      .then((res) => {
        if (res.status == true) {
          if (data.enable_logs) { log('SEND EVENT DATA TO GOOGLE BIGQUERY'); }
          send_to_bq(event_data);
        }
        return res;
      })
      // Send data to custom endpoint
      .then((res) => {
        if (res.status == true) {
          if (data.send_data_to_custom_endpoint) {
            if (data.enable_logs) { log('SEND EVENT DATA TO CUSTOM ENDPOINT'); }
            send_to_custom_endpoint(data.custom_request_endpoint_path, event_data);
          }
        }
      });
  }
}


// Return response
function return_response(event_data, status_code, message) {
  runContainer(event_data, () => {
    setResponseStatus(status_code);
    setResponseHeader('Access-Control-Allow-Credentials', 'true');
    setResponseHeader('Access-Control-Allow-Origin', request_origin);
    setResponseHeader('Access-Control-Allow-Methods', 'POST');
    setResponseHeader('cache-control', 'no-store');
    setResponseBody(JSON.stringify({
      status_code: status_code,
      response: message,
      data: event_data
    }));

    returnResponse();

    if (status_code === 403) {
      if (data.enable_logs) { log('🔴 Request refused'); }
    }
  });
}


// ------------------------------------------------------------------------------------------------------------------------------------------------------


// Send data to Google Firestore
function send_to_firestore(event_data) {
  const projectId = data.bq_project_id;
  const queries = [['client_id', '==', event_data.client_id]];
  const collection_path = 'users';
  const document_path = collection_path + '/' + event_data.client_id;

  return Firestore.query(collection_path, queries, { projectId: projectId, limit: 1 })
    .then((documents) => {

      // REJECT REQUESTS (orphan events) 
      if (event_data.event_name != 'page_view' && documents.length === 0) {
        message = "🔴 Orphan event: user doesn't exist in Firestore. Trigger a page_view event first to create a new user and a new session";
        if (data.enable_logs) { log(message); }
        if (data.enable_logs) { log('REQUEST STATUS'); }
        return { status: false, status_code: 403, message: message };
      } if (event_data.event_name != 'page_view' && !documents[0].data.sessions.some(s => s.session_id === event_data.session_id)) {
        message = "🔴 Orphan event: session doesn't exist in Firestore. Trigger a page_view event first to create a new session";
        if (data.enable_logs) { log(message); }
        if (data.enable_logs) { log('REQUEST STATUS'); }
        return { status: false, status_code: 403, message: message };
      }

      // Set cookies
      if (event_origin == 'Website') {
        const user_cookie_max_age = 400 * 24 * 60 * 60;
        const session_cookie_max_age = (makeNumber(data.session_max_age) || 30) * 60;

        set_cookie(user_cookie_name, event_data.client_id, user_cookie_max_age);
        set_cookie(session_cookie_name, event_data.page_id, session_cookie_max_age);
      }

      // If user does not exist in Firestore
      if (documents && documents.length === 0) {
        if (data.enable_logs) { log('👉 User does not exist'); }
        if (data.enable_logs) { log('👉 Session does not exist'); }

        // Set user and session parameter values for Firestore from current event data
        const firestore_data = {
          user_date: event_data.event_date,
          client_id: event_data.client_id,
          user_channel_grouping: event_data.event_data.channel_grouping,
          user_source: event_data.event_data.source,
          user_tld_source: event_data.event_data.tld_source,
          user_campaign: event_data.event_data.campaign,
          user_campaign_id: event_data.event_data.campaign_id,
          user_campaign_click_id: event_data.event_data.campaign_click_id,
          user_campaign_term: event_data.event_data.campaign_term,
          user_campaign_content: event_data.event_data.campaign_content,
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
            session_campaign_id: event_data.event_data.campaign_id,
            session_campaign_click_id: event_data.event_data.campaign_click_id,
            session_campaign_term: event_data.event_data.campaign_term,
            session_campaign_content: event_data.event_data.campaign_content,
            session_device_type: event_data.event_data.device_type,
            session_country: event_data.event_data.country,
            session_language: event_data.event_data.browser_language,
            session_hostname: event_data.page_data.page_hostname,
            session_browser_name: event_data.event_data.browser_name,
            session_landing_page_category: event_data.page_data.page_category,
            session_landing_page_location: event_data.page_data.page_location,
            session_landing_page_title: event_data.page_data.page_title,
            session_exit_page_category: event_data.page_data.page_category,
            session_exit_page_location: event_data.page_data.page_location,
            session_exit_page_title: event_data.page_data.page_title,
            session_start_timestamp: (event_data.event_name == 'page_view') ? event_data.event_timestamp : 'null',
            session_end_timestamp: event_data.event_timestamp,
            user_id: event_data.session_data.user_id || null,
            total_events: 1,
            total_page_views: 1
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
        if (data.enable_logs) { log('👉 Payload to send: ', firestore_data); }

        return Firestore.write(document_path, firestore_data, { projectId: projectId, merge: true })
          .then(
            (id) => {
              if (data.enable_logs) { log('🟢 User successfully created in Firestore, session successfully added into Firestore'); }

              // Add user parameters to Big Query        
              for (let key in firestore_data) {
                if (firestore_data.hasOwnProperty(key) && key !== 'sessions') {
                  event_data.user_data[key] = firestore_data[key];
                }
              }

              event_data.user_date = event_data.user_data.user_date;

              Object.delete(event_data.user_data, 'user_date');
              Object.delete(event_data.user_data, 'client_id');

              // Add session parameters to Big Query 
              event_data.session_data = firestore_data.sessions[0];
              event_data.session_date = event_data.session_data.session_date;

              Object.delete(event_data.session_data, 'session_date');
              Object.delete(event_data.session_data, 'session_id');

              return { status: true, status_code: 200, message: '🟢 Request claimed successfully' };
            },
            () => {
              message = '🔴 User or session data not created in Firestore';
              status_code = 403;

              if (data.enable_logs) { log(message); }
              return { status: false, status_code: status_code, message: message };
            }
          );

        // If user exists in Firestore  
      } else {
        if (data.enable_logs) { log('👉 User exist'); }

        const firestore_data = documents[0].data;
        const sessions_data = firestore_data.sessions;
        const last_session = sessions_data.slice(-1)[0];
        // const last_session = sessions_data.filter(s => s.session_id === event_data.session_id)[0] || null;

        // Update user values in Firestore from current user data if not already exists or has a not null value        
        const protected_keys = [
          "user_date",
          "user_channel_grouping",
          "user_source",
          "user_tld_source",
          "user_campaign",
          "user_campaign_id",
          "user_campaign_click_id",
          "user_campaign_term",
          "user_campaign_content",
          "user_device_type",
          "user_country",
          "user_language",
          "user_first_session_timestamp",
          "user_last_session_timestamp"
        ];

        Object.keys(event_data.user_data).forEach(function (key) {
          const value = event_data.user_data[key];

          if (value == null) { return; }
          if (protected_keys.indexOf(key) !== -1 && firestore_data[key] != null) { return; }

          if (firestore_data[key] !== value) {
            firestore_data[key] = value;
          }
        });

        // Update last session timestamp of the user
        if (event_data.session_id != last_session.session_id) {
          firestore_data.user_last_session_timestamp = event_data.event_timestamp;
        }

        // Add user parameters to Big Query        
        for (let key in firestore_data) {
          if (firestore_data.hasOwnProperty(key) && key !== 'sessions') {
            event_data.user_data[key] = firestore_data[key];
          }
        }

        event_data.user_date = event_data.user_data.user_date;

        Object.delete(event_data.user_data, 'user_date');
        Object.delete(event_data.user_data, 'client_id');

        // If session doesn't exists in Firestore
        if (event_data.session_id != last_session.session_id) {
          if (data.enable_logs) { log('👉 Session does not exist'); }

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
            session_campaign_id: event_data.event_data.campaign_id,
            session_campaign_click_id: event_data.event_data.campaign_click_id,
            session_campaign_term: event_data.event_data.campaign_term,
            session_campaign_content: event_data.event_data.campaign_content,
            session_device_type: event_data.event_data.device_type,
            session_country: event_data.event_data.country,
            session_language: event_data.event_data.browser_language,
            session_hostname: event_data.page_data.page_hostname,
            session_browser_name: event_data.event_data.browser_name,
            session_landing_page_category: (event_data.page_data.page_category) ? event_data.page_data.page_category : null,
            session_landing_page_location: event_data.page_data.page_location,
            session_landing_page_title: event_data.page_data.page_title,
            session_exit_page_category: (event_data.page_data.page_category) ? event_data.page_data.page_category : null,
            session_exit_page_location: event_data.page_data.page_location,
            session_exit_page_title: event_data.page_data.page_title,
            session_start_timestamp: (event_data.event_name == 'page_view') ? event_data.event_timestamp : null,
            session_end_timestamp: event_data.event_timestamp,
            user_id: event_data.session_data.user_id || null,
            total_events: 1,
            total_page_views: 1
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
          if (data.enable_logs) { log('👉 Payload to send: ', firestore_data); }

          return Firestore.write(document_path, firestore_data, { projectId: projectId, merge: true })
            .then(
              (id) => {
                if (data.enable_logs) { log('🟢 User already in Firestore, session successfully added into Firestore'); }

                // Add data to BigQuery
                event_data.session_data = firestore_data.sessions.slice(-1)[0];
                event_data.session_date = event_data.session_data.session_date;

                Object.delete(event_data.session_data, 'session_date');
                Object.delete(event_data.session_data, 'session_id');

                return { status: true, status_code: 200, message: '🟢 Request claimed successfully' };
              },
              () => {
                message = '🔴 User or session data not added in Firestore';
                status_code = 403;

                if (data.enable_logs) { log(message); }
                return { status: false, status_code: status_code, message: message };
              }
            );

          // If session exists in Firestore        
        } else {
          if (data.enable_logs) { log('👉 Session exist'); }

          // Update session values in Firestore from current session data if not already exists or has a not null value 
          const protected_keys = [
            "session_date",
            "session_id",
            "session_number",
            "cross_domain_session",
            "session_channel_grouping",
            "session_source",
            "session_tld_source",
            "session_campaign",
            "session_campaign_id",
            "session_campaign_click_id",
            "session_campaign_term",
            "session_campaign_content",
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
            "session_end_timestamp",
            "user_id",
            "total_events",
            "total_page_views"
          ];

          Object.keys(event_data.session_data).forEach(function (key) {
            const value = event_data.session_data[key];

            if (value == null) { return; }
            if (protected_keys.indexOf(key) !== -1 && last_session[key] != null) { return; }

            if (last_session[key] !== value) {
              last_session[key] = value;
            }
          });

          // Update session values in Firestore from current event data
          last_session.session_exit_page_category = (event_data.page_data.page_category) ? event_data.page_data.page_category : null;
          last_session.session_exit_page_location = event_data.page_data.page_location;
          last_session.session_exit_page_title = event_data.page_data.page_title;
          last_session.session_end_timestamp = event_data.event_timestamp;
          if (last_session.cross_domain_session == 'No') {
            last_session.cross_domain_session = (event_data.event_data.cross_domain_id) ? 'Yes' : 'No';
          }

          if (event_data.event_name == 'login') { last_session.user_id = event_data.session_data.user_id; }
          if (event_data.event_name == 'logout') { last_session.user_id = null; }
          last_session.total_events = last_session.total_events + 1;
          if (event_data.event_name == 'page_view') { last_session.total_page_views = last_session.total_page_views + 1; }

          // Send data to firestore                    
          if (data.enable_logs) { log('👉 Payload to send: ', firestore_data); }

          return Firestore.write(document_path, firestore_data, { projectId: projectId, merge: true })
            .then(
              (id) => {
                if (data.enable_logs) { log('🟢 User already in Firestore, session successfully updated into Firestore'); }

                // Add data for BigQuery
                event_data.session_data = last_session;
                event_data.session_date = last_session.session_date;

                Object.delete(event_data.session_data, 'session_date');
                Object.delete(event_data.session_data, 'session_id');

                return { status: true, status_code: 200, message: '🟢 Request claimed successfully' };
              },
              () => {
                message = '🔴 User or session data not updated in Firestore';
                status_code = 403;

                if (data.enable_logs) { log(message); }
                return { status: false, status_code: status_code, message: message };
              }
            );
        }
      }


    });
}


// Set user cookie
function set_cookie(cookie_name, cookie_value, max_age) {
  const cookie_domain = '.' + computeEffectiveTldPlusOne(request_origin);
  const cookie_path = '/';
  const cookie_secure = true;
  const sameSite = "Strict";
  const httpOnly = true;

  const cookie_options = {
    domain: cookie_domain,
    path: cookie_path,
    secure: cookie_secure,
    sameSite: sameSite,
    'max-age': max_age,
    httpOnly: httpOnly
  };

  setCookie(cookie_name, cookie_value, cookie_options);
}


// ------------------------------------------------------------------------------------------------------------------------------------------------------


// Send data to Google BigQuery
function send_to_bq(event_data) {
  const payload_copy = JSON.parse(JSON.stringify(event_data));

  if (data.enable_logs) { log('👉 Payload to send: ', payload_copy); }

  // Encode data for Google BigQuery        
  encode_data(payload_copy, 'user_data');
  encode_data(payload_copy, 'session_data');
  encode_data(payload_copy, 'page_data');
  encode_data(payload_copy, 'event_data');
  encode_data(payload_copy, 'consent_data');
  encode_data(payload_copy, 'gtm_data');

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
    () => { if (data.enable_logs) { log('🟢 Payload data inserted successfully into BigQuery'); } },
    () => { if (data.enable_logs) { log('🔴 Payload data not inserted into BigQuery'); } }
  );
}


// Encode event data
function encode_data(bq_event_data, prop) {
  if (bq_event_data[prop] && Object.keys(bq_event_data[prop]).length > 0) {
    var mapped_data = [];
    Object.keys(bq_event_data[prop]).forEach((key) => {
      var temp_data = {};
      // Is string 
      if (getType(bq_event_data[prop][key]) == 'string') {
        temp_data.name = key;
        temp_data.value = { string: bq_event_data[prop][key] || null };
        // Is number (integer or float)    
      } else if (getType(bq_event_data[prop][key]) == 'number') {
        if (bq_event_data[prop][key] % 1 != 0) {
          temp_data.name = key;
          temp_data.value = { float: bq_event_data[prop][key] };
        } else {
          temp_data.name = key;
          temp_data.value = { int: bq_event_data[prop][key] };
        }
        // Is JSON (object or array) 
      } else if (getType(bq_event_data[prop][key]) == 'object' || getType(bq_event_data[prop][key]) == 'array') {
        temp_data.name = key;
        temp_data.value = { json: JSON.stringify(bq_event_data[prop][key]) };

        // Is null or undefined
      } else if (getType(bq_event_data[prop][key]) == 'null' || getType(bq_event_data[prop][key]) == 'undefined') {
        temp_data.name = key;
        temp_data.value = null;
        // Is boolean        
      } else if (getType(bq_event_data[prop][key]) == 'boolean') {
        temp_data.name = key;
        temp_data.value = { bool: bq_event_data[prop][key] };
      }
      mapped_data.push(temp_data);
    });
    bq_event_data[prop] = mapped_data;
  }
}


// ------------------------------------------------------------------------------------------------------------------------------------------------------


// Send data to custom endpoint 
function send_to_custom_endpoint(custom_request_endpoint_path, event_data) {
  if (data.enable_logs) { log('👉 Payload to send: ', event_data); }

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
        if (data.enable_logs) { log('🟢 Request sent successfully to:', custom_request_endpoint_path); }
      } else {
        if (data.enable_logs) { log('🔴 Request not sent successfully. Error:', result); }
      }
    });
}