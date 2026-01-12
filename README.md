# Nameless Analytics | Server-side Client Tag

The Nameless Analytics Server-side Client Tag is a highly customizable GTM custom template designed to claim and enhance requests from [Nameless Analytics Client-side Tracker Tag](https://github.com/nameless-analytics/nameless-analytics-client-side-tracker-tag/) and other sources.

For an overview of how Nameless Analytics works [start from here](https://github.com/nameless-analytics/nameless-analytics/#high-level-data-flow).



## TOC
* [Nameless Analytics Server-side Client Tag UI](#nameless-analytics-server-side-client-tag-ui)
* [User data](#user-data)
  * [User parameters](#user-parameters)
    * [Add/override user level parameters](#addoverride-user-level-parameters)
    * [Remove user level parameters](#remove-user-level-parameters)
* [Session data](#session-data)
  * [Session parameters](#session-parameters)
    * [Add/override User ID](#addoverride-user-id-parameter)
    * [Add/override session level parameters](#addoverride-session-level-parameters)
    * [Remove session level parameters](#remove-session-level-parameters)
* [Event data](#event-data)
  * [Event parameters](#event-parameters)
    * [Add/override event level parameters](#addoverride-event-level-parameters)
    * [Remove event level parameters](#remove-event-level-parameters)
* [Client settings](#client-settings)
  * [Endpoint path](#endpoint-path)
  * [Accept requests from authorized domains only](#accept-requests-from-authorized-domains-only)
  * [Reject requests by IP](#reject-requests-by-ip)
* [Google BigQuery settings](#google-bigquery-settings)
  * [Google BigQuery project ID](#project-name)
  * [Google BigQuery dataset ID](#dataset-name)
  * [Google BigQuery table ID](#table-name)
* [Session settings](#session-settings)
  * [Change user and session cookie prefix](#change-user-and-session-cookie-prefix)
  * [Change default session duration](#change-default-session-duration)
* [Advanced settings](#advanced-settings)
   * [Send data to custom endpoint](#send-data-to-custom-endpoint)
   * [Enable logs in preview mode](#enable-logs-in-preview-mode)
* [Execution messages](#execution-messages)
  * [Success messages](#success-messages) 
  * [Error messages](#error-messages) 



## Nameless Analytics Server-side Client Tag UI
This is the UI of the Nameless Analytics Server-side Client Tag.

![Nameless Analytics Server-side Client Tag UI](https://github.com/user-attachments/assets/f8525c4f-cd3e-471b-894d-dab219a6a58f)



## User data
### User parameters
Add user parameters for all events. The parameters will be added in the user_data object in the payload.

They are:
- written in Google Cloud Firestore every time they change --> latest values 
- read and sent to BigQuery with the current parameter status --> current values 

#### Add/override user level parameters
Accepted values: strings, integers, floats, and JSON.

These parameters can override:
- User parameters added in Nameless Analytics Client-side Tracker Configuration Variable

#### Remove user level parameters
Remove user level parameters in user_data object in the payload. 



## Session data
### Session parameters
Add session parameters for all events. The parameters will be added in the session_data object in the payload.

They are:
- written in Google Cloud Firestore every time they change --> latest values 
- read and sent to BigQuery with the current parameter status --> current values 

#### Add/override User ID parameter
Accepted values: strings. 

These parameters can override:
- User ID parameter added in Nameless Analytics Client-side Tracker Configuration Variable

#### Add/override session level parameters
Accepted values: strings, integers, floats, and JSON.

These parameters can override:
- Session parameters added in Nameless Analytics Client-side Tracker Configuration Variable

#### Remove session level parameters
Remove session level parameters in session_data object in the payload. 



## Event data
### Event parameters
Add event parameters for all events. The parameters will be added in the event_data object in the payload.

#### Add/override event level parameters
Accepted values: strings, integers, floats, and JSON.

These parameters can override:
- Event parameters added in the Nameless Analytics Client-side Tracker Tag
- Shared event parameters added in the Nameless Analytics Client-side Tracker Configuration Variable
- dataLayer event parameters added in the Nameless Analytics Client-side Tracker Tag
- Default event parameters

#### Remove event level parameters
Remove event level parameters in event_data object in the payload. 



## Client settings
### Endpoint path
Endpoint path to which requests have to be sent.


### Accept requests from authorized domains only
Set the specific domains from which requests can be claimed.

If the Server-side Google Tag Manager container needs to claim requests from multiple domains, all those domains must be listed in the "Allowed domains" field. Add one domain per row.

To ensure proper DNS resolution, the IP addresses of the Google App Engine or Cloud Run instances must be correctly associated with each respective domain name.

Follow these guides for:
- [Google App Engine standard environment](https://cloud.google.com/appengine/docs/standard/mapping-custom-domains)
- [Google App Engine flexible environment](https://cloud.google.com/appengine/docs/flexible/mapping-custom-domains)
- [Google Cloud Run](https://cloud.google.com/run/docs/mapping-custom-domains)

The container must be configured as well. Add the domains in the "Container settings" of the Server-side Google Tag Manager.

To select a domain for the preview mode, click the icon near the preview button and select a domain.


### Reject requests by IP
Reject requests from unauthorized IP addresses.


### API key for Streaming protocol requests
Secure the Streaming protocol (Measurement Protocol) endpoint by requiring a secret API key.

When the **"Add API key for Streaming protocol"** checkbox is enabled, the Client Tag will reject any request where the `event_origin` is set to `Streaming protocol` unless it includes a valid `x-api-key` header matching the configured value.

Requests with `event_origin` set to `Website` are not affected by this setting, ensuring seamless browser tracking without the need for additional headers or CORS preflight requests.

#### Streaming protocol request example
For a **Python implementation** that integrates with BigQuery, see the [Streaming Protocol Python Script](../nameless-analytics/streaming-protocol/README.md).



## Google BigQuery settings
### Project name
The unique ID of the Google Cloud Project.


### Dataset name
The ID of the BigQuery dataset where Nameless Analytics will store its tables. This dataset must be created before the tag can write data.


### Table name
The name of the main raw events table. By default, this is set to `events_raw`.

**Mandatory Schema**: The BigQuery table must have a schema that matches the Nameless Analytics payload. Create it using the Create tables DML query in the [Create tables](https://github.com/nameless-analytics/nameless-analytics/blob/main/tables/README.md#create-tables) section.

See the [Request Payload Example](https://github.com/nameless-analytics/nameless-analytics/#request-payload-data) for the exact structure.



## Advanced settings
### Send data to custom endpoint
Send POST requests to custom endpoint with the same data loaded into Google BigQuery. 


### Change user and session cookie prefix
Change the user and session cookie prefix. Default prefix: na_u and na_s. See [Cookie section](https://github.com/nameless-analytics/nameless-analytics/#cookies) for more information.


### Change default session duration
Change the session duration in minutes. Default value: 30 min.


### Enable logs in preview mode
Enable logs for all events in preview mode. 

Please note:  If cross-domain is enabled, all domains will send events in relative preview mode. For more information, see the [Cross-domain section](https://github.com/nameless-analytics/nameless-analytics-client-side-tracker-configuration-variable/#enable-cross-domain-tracking).



## Execution messages
### Success messages
The following success messages can be found in the GTM Server Preview mode logs or returned in the response JSON:

| **Scope** | **Message** | **Description** |
|:---|:---|:---|
| Data validation | `🟢 Request correct` | The incoming request passed all validation checks |
| | `🟢 Request correct, user and session cookie found. Cross-domain link decoration will be applied` | Success log for `get_user_data` cross-domain requests |
| | `🟢 Request claimed successfully` | Default success message for a fully processed event |
| Data storage | `🟢 User successfully created in Firestore, session successfully added into Firestore` | Confirmation that a new user and their first session were persisted |
| | `🟢 User already in Firestore, session successfully added into Firestore` | Confirmation that a new session was added to an existing user |
| | `🟢 User already in Firestore, session successfully updated into Firestore` | Confirmation that an existing session was refreshed |
| | `🟢 Payload data inserted successfully into BigQuery` | Confirmation that the event was pushed to BigQuery |
| | `🟢 Request sent successfully to: [URL]` | Forwarded successfully to a custom endpoint |


### Error messages
These messages are returned with a **403 Forbidden** status code or logged when a request is rejected:

| **Scope** | **Message** | **What it means** | **How to fix it** |
|:---|:---|:---|:---|
| Data validation | `🔴 Request refused` | The request was blocked by the Client Tag logic | Check the server logs for specific validation errors (IP, Origin, etc.) |
| | `🔴 Request method not correct` | The request was not a `POST` request | Ensure your tracker is sending data via POST |
| | `🔴 Request IP not authorized` | The request came from a banned IP address | Check the "Banned IPs" list in the Client Tag settings |
| | `🔴 Request origin not authorized` | The request came from an unauthorized domain | Add the calling domain to the "Authorized domains" list in settings |
| | `🔴 Missing User-Agent header. Request from bot` | The request is missing the standard User-Agent header | Use a standard browser or ensure your client sends a valid UA string |
| | `🔴 Invalid User-Agent header value. Request from bot` | The request was identified as an automated bot or scraper | No action needed for real users |
| | `🔴 Invalid event_origin parameter value. Accepted values: Website` | The `event_origin` parameter for get_user_data event is missing or incorrect | Ensure the client-side tracker is correctly setting the origin to "Website" |
| | `🔴 Invalid event_origin parameter value. Accepted values: Website or Streaming protocol` | The `event_origin` parameter for standard events is missing or incorrect | Ensure the client-side tracker is correctly setting the origin to "Website" or "Streaming protocol" |
| | `🔴 Invalid event_name. Can't send page_view from Streaming protocol` | Sequence error: `page_view` cannot be sent via Streaming protocol | Use the website tracker for `page_view` events |
| | `🔴 Missing required parameters: [parameters]` | The incoming JSON payload is missing mandatory fields | Check that your tracker is sending all required fields |
| | `🔴 Invalid API key` | The `x-api-key` header for Streaming protocol is missing or incorrect | Provide the correct API key in the request headers |
| | `🔴 Orphan event: missing user cookie. Trigger a page_view event first to create a new user and a new session` | Event received for a new visitor without a preceding `page_view` | Ensure `page_view` fires first |
| | `🔴 Orphan event: missing session cookie. Trigger a page_view event first to create a new session` | Event received for a returning visitor with an expired session without `page_view` | Ensure `page_view` fires first |
| | `🔴 Orphan event: user doesn't exist in Firestore. Trigger a page_view event first to create a new user and a new session` | Firestore check: session creation attempt without `page_view` context | Ensure `page_view` fires first |
| | `🔴 Orphan event: session doesn't exist in Firestore. Trigger a page_view event first to create a new session` | Firestore check: session refresh attempt without `page_view` context | Ensure `page_view` fires first |
| Data storage | `🔴 User or session data not created in Firestore` | The initial Firestore write operation failed | Check GCP project permissions and quotas |
| | `🔴 User or session data not added in Firestore` | Failed to append a new session to an existing user document | Verify Firestore permissions |
| | `🔴 User or session data not updated in Firestore` | Failed to update current session data in Firestore | Verify Firestore permissions |
| | `🔴 Payload data not inserted into BigQuery` | The streaming insert to BigQuery failed | Check BigQuery dataset/table permissions |
| | `🔴 Request not sent successfully. Error: [result]` | Forwarding to the custom endpoint failed | Verify the custom endpoint URL |
| Cross-domain | `🔴 User cookie not found. No cross-domain link decoration will be applied` | Required user cookie is missing on the server for ID retrieval | Ensure the visitor has a valid `na_u` cookie |
| | `🔴 Session cookie not found. No cross-domain link decoration will be applied` | Required session cookie is missing on the server for ID retrieval | Ensure the visitor has a valid `na_s` cookie |


---

Reach me at: [Email](mailto:hello@tommasomoretti.com) | [Website](https://tommasomoretti.com/?utm_source=github.com&utm_medium=referral&utm_campaign=nameless_analytics) | [Twitter](https://twitter.com/tommoretti88) | [LinkedIn](https://www.linkedin.com/in/tommasomoretti/)
