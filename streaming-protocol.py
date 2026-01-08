# NAMELESS ANALYTICS STREAMING PROTOCOL 
# PYTHON EXAMPLE CODE  

import requests
import secrets
from datetime import datetime, timezone


# --------------------------------------------------------------------------------------------------------------


full_endpoint = 'https://gtm.domain.com/nameless' # Modify this according to your GTM Server-side endpoint 
origin = 'https://domain.com' # Modify this according to request origin
gtm_preview_header = '[X-Gtm-Server-Preview]' # Modify this according with GTM Server-side preview header 
api_key = '[API-KEY]' # Modify this according to the api_key in the Nameless Analytics Server-side Client Tag

user_id = '1234' # Add it if exists
client_id = "ji7j16FMycg8GjL" # Modify this according to the current user's client_id
session_id = "3uc3LhDUZKCVoKs" # Modify this according to the current user's session_id

page_id = '6UA4RGuENikj4wH' # Modify this according to the current user's page_id

event_date = datetime.now(timezone.utc).strftime('%Y-%m-%d')
event_timestamp = int(datetime.now(timezone.utc).timestamp() * 1000)
event_id = f'{page_id}_{secrets.token_hex(8)}'
event_name = 'page_view' # Modify this according to the event to be sent
event_origin = "Streaming protocol"
user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'


# --------------------------------------------------------------------------------------------------------------


# Required fields
payload = {
    "user_data": {
    },
    "session_data": {
      # "user_id": user_id,
    },

    "page_date": event_date,
    "page_id": page_id,
    "page_data": {
        # "page_title": None,
        "page_hostname_protocol": "https",
        "page_hostname": "tommasomoretti.com",
        # "page_location": "/",
        # "page_fragment": None,
        # "page_query": None,
        # age_extension": None,
        # age_referrer": None,
        # age_timestamp": None,
        # age_category": None,
        # age_language": None
    },

    "event_date": event_date,
    "event_timestamp": event_timestamp,
    "event_id": event_id,
    "event_name": event_name,
    "event_origin": event_origin,
    "event_data": {
        "event_type": "page_view" if event_name == "page_view" else "event"
    },

    "ecommerce": {
        # Add ecommerce data here
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
    'User-Agent': user_agent,
    'Cookie': f'na_u={client_id}; na_s={client_id}_{session_id}-{page_id}',
    'x-api-key': api_key
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