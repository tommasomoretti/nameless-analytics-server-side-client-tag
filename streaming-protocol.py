# NAMELESS ANALYTICS STREAMING PROTOCOL 
# PYTHON EXAMPLE CODE  

import requests
import secrets
import json
from datetime import datetime, timezone


# --------------------------------------------------------------------------------------------------------------


# full_endpoint = 'https://gtm.domain.com/nameless_analytics' # Modify this according to your GTM Server-side endpoint 
# origin = 'https://domain.com' # Modify this according to request origin
# gtm_preview_header = '[X-Gtm-Server-Preview]' # Modify this according with GTM Server-side preview header 

full_endpoint = 'https://gtm.tommasomoretti.com/tm/nameless'
origin = 'https://tommasomoretti.com'
gtm_preview_header = 'ZW52LTEwMnxUWk9Pd1l1SW5YWFU0eFpzQlMtZHN3fDE5YWE3MzU1M2ExODYwMzNmNzU1ZA=='


event_date = datetime.now(timezone.utc).strftime('%Y-%m-%d')
event_timestamp = int(datetime.now(timezone.utc).timestamp() * 1000)
event_origin = 'Website'
client_id = "AaArUTLQFByAz3" # Modify this according to the current user's client_id
user_id = None # Add it if exists
session_id = "AaArUTLQFByAz3_1PNSySPUv4Qspz" # Modify this according to the current user's session_id
event_name = 'page_view' # Modify this according to the event to be sent
page_id = 'M7hP9AnfD6XA15' # Modify this according to the current user's page_id
event_id = f'{page_id}_{secrets.token_hex(8)}'
user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'



# --------------------------------------------------------------------------------------------------------------



# Required fields
payload = {
    "user_date": "2025-11-16",
    "client_id": "AaArUTLQFByAz3",
    "user_data": {
        "user_campaign_id": None,
        "user_country": None,
        "user_device_type": None,
        "user_channel_grouping": None,
        "user_source": None,
        "user_first_session_timestamp": None,
        "user_campaign_content": None,
        "user_campaign": None,
        "user_campaign_click_id": None,
        "user_tld_source": None,
        "user_language": None,
        "user_campaign_term": None,
        "user_last_session_timestamp": None
    },
    "session_date": "2025-11-18",
    "session_id": "AaArUTLQFByAz3_4QEvlcNicwrhWVb",
    "session_data": {
        "session_number": None,
        "cross_domain_session": None,
        "session_channel_grouping": None,
        "session_source": None,
        "session_tld_source": None,
        "session_campaign": None,
        "session_campaign_id": None,
        "session_campaign_click_id": None,
        "session_campaign_term": None,
        "session_campaign_content": None,
        "session_device_type": None,
        "session_country": None,
        "session_language": None,
        "session_hostname": None,
        "session_browser_name": None,
        "session_landing_page_category": None,
        "session_landing_page_location": None,
        "session_landing_page_title": None,
        "session_exit_page_category": None,
        "session_exit_page_location": None,
        "session_exit_page_title": None,
        "session_start_timestamp": None,
        "session_end_timestamp": None
    },
    "page_date": "2025-11-18",
    "page_id": "AaArUTLQFByAz3_4QEvlcNicwrhWVb-UdeMuCs5CRFUTZj",
    "page_data": {
        "page_title": None,
        "page_hostname_protocol": "https",
        "page_hostname": "tommasomoretti.com",
        "page_location": "/",
        "page_fragment": None,
        "page_query": None,
        "page_extension": None,
        "page_referrer": None,
        "page_timestamp": None,
        "page_category": None,
        "page_language": None
    },

    "event_date": "2025-11-18",
    "event_timestamp": 1763494286137,
    "event_id": "AaArUTLQFByAz3_4QEvlcNicwrhWVb-UdeMuCs5CRFUTZj_DQVoYNsJymcWLOh",
    "event_name": event_name,
    "event_origin": event_origin,
    "event_data": {
        "event_type": "page_view", # page_view || virtual_page_view || event
        "channel_grouping": None,
        "source": None,
        "campaign": None,
        "campaign_id": None,
        "campaign_click_id": None,
        "campaign_term": None,
        "campaign_content": None,
        "user_agent": None,
        "browser_name": None,
        "browser_language": None,
        "browser_version": None,
        "device_type": None,
        "device_vendor": None,
        "device_model": None,
        "os_name": None,
        "os_version": None,
        "screen_size": None,
        "viewport_size": None,
        "country": None,
        "city": None,
        "tld_source": None
    },
    "consent_data": {
        "consent_type": None,
        "respect_consent_mode": None,
        "ad_user_data": None,
        "ad_personalization": None,
        "ad_storage": None,
        "analytics_storage": None,
        "functionality_storage": None,
        "personalization_storage": None,
        "security_storage": None
    },
    "gtm_data": {
        "cs_hostname": None,
        "cs_container_id": None,
        "cs_tag_name": None,
        "cs_tag_id": None,
        "ss_hostname": None,
        "ss_container_id": None,
        "ss_tag_name": None,
        "ss_tag_id": None,
        "processing_event_timestamp": None,
        "content_length": None
    }
}



print("----- NAMELESS ANALYTICS -----")
print("----- STREAMING PROTOCOL -----")
print("Function execution start: 🤞")
print('👉 Send request to ' + full_endpoint)

headers = {
    'Content-Type': 'application/json',
    'Origin': origin,
    'X-Gtm-Server-Preview': gtm_preview_header,
    'User-Agent': user_agent
}

try:
    response = requests.post(full_endpoint, json=payload, headers=headers)
    response_json = response.json()

    if "response" in response_json:
        response_json["response"] = bytes(response_json["response"], "latin1").decode("utf-8")

    print(" ", response_json.get("response"))    
    print("Function execution end: 👍")

except Exception as e:
    print(" ", response)
    print("Function execution end: 🖕🏻")