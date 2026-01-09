# NAMELESS ANALYTICS STREAMING PROTOCOL 
# PYTHON EXAMPLE CODE  

import requests
import secrets
import sys
from datetime import datetime, timezone
from google.cloud import bigquery


# --------------------------------------------------------------------------------------------------------------


# User cookies
na_u = 'iGybyojfMznbfe7' # Modify this according to the current user's na_u cookie value
na_s = 'iGybyojfMznbfe7_dFnDUvIIDpausKh-mYAnphPDNl8o8bP' # Modify this according to the current user's na_s cookie value


# Request settings
full_endpoint = 'https://gtm.tommasomoretti.com/tm/nameless' # Modify this according to your GTM Server-side endpoint 
origin = 'https://tommasomoretti.com' # Modify this according to request origin
api_key = '1234' # Modify this according to the API key in the Nameless Analytics Server-side Client Tag
gtm_preview_header = 'ZW52LTEwMnxUWk9Pd1l1SW5YWFU0eFpzQlMtZHN3fDE5YmExNTRjMTNjYWFlOGY0ZDJhOQ==' # Modify this according with GTM Server-side preview header 

# full_endpoint = 'https://gtm.domain.com/nameless' # Modify this according to your GTM Server-side endpoint 
# origin = 'https://domain.com' # Modify this according to request origin
# gtm_preview_header = '[X-Gtm-Server-Preview]' # Modify this according with GTM Server-side preview header 
# api_key = '[API-KEY]' # Modify this according to the api_key in the Nameless Analytics Server-side Client Tag


# Event settings
user_id = '1234' # Add it if needed

event_name = 'purchase' # Modify this according to the event to be sent
event_date = datetime.now(timezone.utc).strftime('%Y-%m-%d')
event_timestamp = int(datetime.now(timezone.utc).timestamp() * 1000)
event_id = f'{na_s}_{secrets.token_hex(8)}'
event_origin = "Streaming protocol"
user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'


# BigQuery settings
bq_project_id = 'tom-moretti' # Modify this according to your BigQuery project ID
bq_dataset_id = 'nameless_analytics' # Modify this according to your BigQuery dataset ID
bq_table_id = 'events_raw' # Modify this according to your BigQuery table ID
bq_credentials_path = '/Users/tommasomoretti/Library/CloudStorage/GoogleDrive-tommasomoretti88@gmail.com/Il mio Drive/Lavoro/Nameless Analytics/worker_service_account.json' # Path to your service account JSON file


# --------------------------------------------------------------------------------------------------------------


# Retreive page data from BigQuery, if not found no hit will be sent
print("NAMELESS ANALYTICS")
print("STREAMING PROTOCOL")
print(f'👉 Retreive page data from BigQuery for page_id: {na_s}')

page_date_from_bq = ""
page_data_from_bq = {}

try:
    client = bigquery.Client.from_service_account_json(bq_credentials_path)
    query = f"""
        SELECT page_date, page_data
        FROM `{bq_project_id}.{bq_dataset_id}.{bq_table_id}`
        WHERE page_id = @na_s
        LIMIT 1
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("na_s", "STRING", na_s),
        ]
    )

    query_job = client.query(query, job_config=job_config)
    results = query_job.result()

    row_found = False
    for row in results:
        row_found = True

        if row.page_date:
            page_date_from_bq = row.page_date.strftime('%Y-%m-%d') if hasattr(row.page_date, 'strftime') else str(row.page_date)
            
        if row.page_data:
            for item in row.page_data:
                name = item.get('name')
                value_struct = item.get('value')
                if name and isinstance(value_struct, dict):
                    for val_type in ['string', 'int', 'float', 'json']:
                        val = value_struct.get(val_type)
                        if val is not None:
                            page_data_from_bq[name] = val
                            break
    
    if not row_found:
        print("  🔴 Page ID not found in BigQuery. Request aborted.")
        sys.exit()
    else:
        print("  🟢 Page data retrieved from BigQuery")

except Exception as e:
    print("🔴 Error retrieving data from BigQuery: ", e)
    sys.exit()


# --------------------------------------------------------------------------------------------------------------


# Event data
payload = {
    "user_data": {
    },

    "session_data": {
      # "user_id": user_id,
    },

    "page_date": page_date_from_bq,
    "page_id": na_s,
    "page_data": page_data_from_bq,

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

print('👉 Send request to ' + full_endpoint)

headers = {
    'X-Gtm-Server-Preview': gtm_preview_header,
    'x-api-key': api_key,

    'Content-Type': 'application/json',
    'Origin': origin,
    'User-Agent': user_agent,
    'Cookie': f'na_u={na_u}; na_s={na_s}' 
}

try:
    response = requests.post(full_endpoint, json=payload, headers=headers)
    
    # Analisi della risposta
    try:
        response_json = response.json()
        message = response_json.get("response", response.text)
        # Decodifica se necessario per correggere emoji/caratteri speciali (mojibake)
        if isinstance(message, str):
            try:
                message = message.encode('latin1').decode('utf-8')
            except:
                pass
        print("  ", message)
    except:
        print("  ", response.text)

    if response.status_code == 200:
        print("Function execution end: 👍")
    else:
        print("Function execution end: 🖕")

except Exception as e:
    print(f"Error while fetch: {e}")