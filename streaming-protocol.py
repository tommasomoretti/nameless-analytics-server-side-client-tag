# NAMELESS ANALYTICS STREAMING PROTOCOL 
# PYTHON EXAMPLE CODE  

import requests
import secrets
import json
import sys
from datetime import datetime, timezone
from google.cloud import bigquery


# --------------------------------------------------------------------------------------------------------------


# Request settings
full_endpoint = 'https://gtm.tommasomoretti.com/tm/nameless' # Modify this according to your GTM Server-side endpoint 
origin = 'https://tommasomoretti.com' # Modify this according to request origin
gtm_preview_header = 'ZW52LTEwMnxUWk9Pd1l1SW5YWFU0eFpzQlMtZHN3fDE5YmExNTRjMTNjYWFlOGY0ZDJhOQ==' # Modify this according with GTM Server-side preview header 
api_key = '1234' # Modify this according to the api_key in the Nameless Analytics Server-side Client Tag

# full_endpoint = 'https://gtm.domain.com/nameless' # Modify this according to your GTM Server-side endpoint 
# origin = 'https://domain.com' # Modify this according to request origin
# gtm_preview_header = '[X-Gtm-Server-Preview]' # Modify this according with GTM Server-side preview header 
# api_key = '[API-KEY]' # Modify this according to the api_key in the Nameless Analytics Server-side Client Tag


# Event settings
user_id = '1234' # Add it if exists
client_id = "ji7j16FMycg8GjL" # Modify this according to the current user's client_id
session_id = "MUsLZmaR7CKzTBo" # Modify this according to the current user's session_id

page_id = f"{client_id}_{session_id}-mD5nbtuO2BsxNSx" # Modify this according to the current user's page_id

event_date = datetime.now(timezone.utc).strftime('%Y-%m-%d')
event_timestamp = int(datetime.now(timezone.utc).timestamp() * 1000)
event_id = f'{page_id}_{secrets.token_hex(8)}'
event_name = 'page_view' # Modify this according to the event to be sent
event_origin = "Streaming protocol"
user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'


# BigQuery settings
bq_project_id = 'tom-moretti' # Modify this according to your BigQuery project ID
bq_dataset_id = 'nameless_analytics' # Modify this according to your BigQuery dataset ID
bq_table_id = 'events_raw' # Modify this according to your BigQuery table ID
bq_credentials_path = '/Users/tommasomoretti/Library/CloudStorage/GoogleDrive-tommasomoretti88@gmail.com/Il mio Drive/Lavoro/Nameless Analytics/worker_service_account.json' # Path to your service account JSON file


# --------------------------------------------------------------------------------------------------------------


# Retreive page data from BigQuery, if not found no hit will be sent
page_data_from_bq = {}

# --------------------------------------------------------------------------------------------------------------


# Event data
payload = {
    "user_data": {
    },

    "session_data": {
      # "user_id": user_id,
    },

    "page_date": event_date, # da recuperare da BigQuery quando page_id = full_page_id
    "page_id": page_id,
    "page_data": page_data_from_bq, # da recuperare da BigQuery quando page_id = full_page_id

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

print("NAMELESS ANALYTICS")
print("STREAMING PROTOCOL")
print("Function execution start: 🤞")
print('👉 Send request to ' + full_endpoint)

headers = {
    'X-Gtm-Server-Preview': gtm_preview_header,
    'x-api-key': api_key,

    'Content-Type': 'application/json',
    'Origin': origin,
    'User-Agent': user_agent,
    'Cookie': f'na_u={client_id}; na_s={page_id}' 
}

try:
    response = requests.post(full_endpoint, json=payload, headers=headers)
    
    # Controllo se la risposta è valida
    if response.status_code == 200:
        try:
            response_json = response.json()
            print(" Response JSON:", response_json)
            if "response" in response_json:
                print(" Message from Server:", response_json["response"])
        except:
            print(" Response Text:", response.text)
        print("Function execution end: 👍")
    else:
        print(" Response:", response.text)
        print("Function execution end: ⚠️")

except Exception as e:
    print(" ", e)
    print("Function execution end: 🖕🏻")