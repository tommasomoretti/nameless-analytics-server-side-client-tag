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
gtm_preview_header = 'ZW52LTEwMnxUWk9Pd1l1SW5YWFU0eFpzQlMtZHN3fDE5YTgyNzYzYWJmOWY5NDQwMDQxOA=='


event_date = datetime.now(timezone.utc).strftime('%Y-%m-%d')
event_timestamp = int(datetime.now(timezone.utc).timestamp() * 1000)
event_origin = 'Website'
client_id = "lrjiZSSxyL7eqG" # Modify this according to the current user's client_id
user_id = None # Add it if exists
session_id = "lrjiZSSxyL7eqG_IXo7Hfz7mx4pWjy" # Modify this according to the current user's session_id
event_name = 'page_view' # Modify this according to the event to be sent
page_id = 'M7hP9AnfD6XA15' # Modify this according to the current user's page_id
event_id = f'{page_id}_{secrets.token_hex(8)}'


# --------------------------------------------------------------------------------------------------------------


# Required fields
payload = {
    "client_id": client_id,
    "user_data": {},
    
    "session_id": session_id,
    "session_data": {},
    
    "page_date": event_date,
    "page_id": page_id,
    "page_data": {
      'pv': 'abcd'
    },

    "event_date": event_date,
    "event_id": event_id,
    "event_timestamp": event_timestamp,
    "event_name": event_name,
    "event_origin": event_origin,
    "event_data": {
      'ev': 'abcd'
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
}

try:
    response = requests.post(full_endpoint, json=payload, headers=headers)
    response_json = response.json()

    if "response" in response_json:
        response_json["response"] = bytes(response_json["response"], "latin1").decode("utf-8")

    print(" ", response_json.get("response"))

    response_data = json.dumps(response_json.get("data", "No data"), indent=2, ensure_ascii=False)

    if response_data == '"No data"':
        print("  👉 Request response:", response_data)

    else:
        indented_response = "\n".join(["     " + line for line in response_data.splitlines()])

        print("  👉 Request response: ")
        print(indented_response)
    
    print("Function execution end: 👍")

except Exception as e:
    print(" ", response)