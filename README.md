<img src="https://github.com/user-attachments/assets/93640f49-d8fb-45cf-925e-6b7075f83927#gh-light-mode-only" alt="Light Mode" />
<img src="https://github.com/user-attachments/assets/71380a65-3419-41f4-ba29-2b74c7e6a66b#gh-dark-mode-only" alt="Dark Mode" />

---

# Server-side client tag
The Nameless Analytics Server-side client tag is a highly customizable GTM custom template designed to claim and enhance requests from [Nameless Analytics Client-side tracker tag](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-tag/) and [Nameless Analytics Streaming protocol](https://github.com/tommasomoretti/nameless-analytics-streaming-protocol/).

For an overview of how Nameless Analytics works [start from here](https://github.com/tommasomoretti/nameless-analytics/).

Table of contents:
- [Client tag UI](#tag-ui)
- Basic settings
  - [Allowed domains](#allowed-domains)
  - [Endpoint path](#endpoint-path)
- User data
  - [User level parameters](#user-parameters)
    - [Add/override user level parameters](#addoverride-user-level-parameters)
    - [Remove user level parameters](#remove-user-level-parameters)
- Session data
  - [Session level parameters](#session-parameters)
    - [Add/override session level parameters](#addoverride-session-level-parameters)
    - [Remove session level parameters](#remove-session-level-parameters)
- Event data
  - [Event level parameters](#event-parameters)
    - [Add/override event level parameters](#addoverride-event-level-parameters)
    - [Remove event level parameters](#remove-event-level-parameters)
- Google BigQuery settings
  - [Project name](#project-name)
  - [Dataset name](#dataset-name)
  - [Table name](#table-name)
-  Advanced settings
   - [Change user cookie name](#change-user-cookie-name)
   - [Change session cookie name](#change-session-cookie-name)
   - [Change default session duration](#change-default-session-duration)
   - [Enable logs in debug view](#enable-logs-in-debug-view)
- [Cookies](#cookies)



# Tag UI
This is the UI of the Server-side client tag.

<img src="https://github.com/user-attachments/assets/76a7e097-78b7-406a-bc01-39a886dcd2d3" alt="Nameless Analytics - Server-side client tag UI" />



# Basic settings
## Allowed domains
Set the allowed domains from which requests can be claimed.

<img src="https://github.com/user-attachments/assets/e7089bdd-89ec-4348-b89a-0cf23865d22b" alt="Allowed domains" />

If Server-Side Google Tag Manager has to claim requests from different domains, all the domains must be allowed, in Allowed domains field. Add a domain, one per row.

<img src="https://github.com/user-attachments/assets/6dc3e7bd-f89e-4bd7-baba-17c93735441e" alt="Allowed domains" />

To guarantee accurate DNS resolution, the IP addresses of Google App Engine or Cloud Run instances need to be appropriately associated with each relevant domain name.
Here's how for:
- [Google App Engine standard environment](https://cloud.google.com/appengine/docs/standard/mapping-custom-domains)
- [Google App Engine flexible environment](https://cloud.google.com/appengine/docs/flexible/mapping-custom-domains)
- [Google Cloud Run](https://cloud.google.com/run/docs/mapping-custom-domains)

<img src="https://github.com/user-attachments/assets/97ab7224-444b-452e-a9f2-4a74b6a3104e" alt="Allowed domains" />

Container must be configured as well. Add the domains in the Container settings of the Server-side Google Tag Manager.

<img src="https://github.com/user-attachments/assets/2ee51716-0fe4-42c2-b1e6-df5697c5809a" alt="Allowed domains" />

To select a domain for the preview mode, click the icon near the preview button

<img src="https://github.com/user-attachments/assets/6fd6d60e-34fc-4e90-86e1-7f53c915847f" alt="Allowed domains" />

and select a domain.

<img src="https://github.com/user-attachments/assets/f43322f8-f128-4a5a-8a1a-0fc3a9b75513" alt="Allowed domains" />


## Endpoint path
Endpoint path to which requests have to be sent.

<img src="https://github.com/user-attachments/assets/cf3e9cf0-3634-4ce1-a25f-c94bc576ff87" alt="Endpoint path" />



# User data
## User parameters
Add user parameters for all events. The parameters will be added in the user_data object in the payload.

They are:
- written in Google Cloud Firestore every time they change --> latest values 
- read and sent to BigQuery with the current parameter status --> current values 

Please note: if a parameter has the same name as another, it can override or be overridden depending on where it was set. 

This is the hierarchy of event parameter importance: 

[Server side parameters](https://github.com/tommasomoretti/nameless-analytics-server-client-tracker-tag/#user-parameters) overrides [User parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-config-variable/#user-parameters)

### Override user ID parameter
Override User ID parameters in user_id field. 

This parameter can override [users ID](https://github.com/tommasomoretti/nameless-analytics-server-side-client-tag/#add-user-id) added in Nameless Analytics Client-Side configuration variable.

### Add/override user level parameters
Add user level parameters in user_data object in the payload. Values accepted: strings, integers, float and json.

These parameter can override [user parameters](https://github.com/tommasomoretti/nameless-analytics-server-side-client-tag/#add-user-level-parameters) added in Nameless Analytics Server-side client tag.

### Remove user level parameters
Remove user level parameters in user_data object in the payload. 



# Session data
## Session parameters
Add session parameters for all events. The parameters will be added in the session_data object in the payload.

They are:
- written in Google Cloud Firestore every time they change --> latest values 
- read and sent to BigQuery with the current parameter status --> current values 

Please note: if a parameter has the same name as another, it can override or be overridden depending on where it was set. 

This is the hierarchy of event parameter importance: 
[Server side parameters](https://github.com/tommasomoretti/nameless-analytics-server-client-tracker-tag/#session-parameters) overrides [Session parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-config-variable/#session-parameters)

### Add/override session level parameters
Add session level parameters in session_data object in the payload. Values accepted: strings, integers, float and json.

These parameter can override [session parameters]([url](https://github.com/tommasomoretti/nameless-analytics-server-side-client-tag/#add-session-level-parameters)) added in Nameless Analytics Server-side client tag.

### Remove session level parameters
Remove session level parameters in session_data object in the payload. 



# Event data
## Event parameters
Add event parameters for all events. The parameters will be added in the event_data object in the payload.

Please note: if a parameter has the same name as another, it can override or be overridden depending on where it was set. 

This is the hierarchy of event parameter importance: 

[Server-side event parameters](https://github.com/tommasomoretti/nameless-analytics-server-side-client-tag/#event-parameters) overrides [Specific event parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-tag/#event-parameters) overrides [Shared event parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-config-variable/#add-shared-event-parameters) overrides [dataLayer parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-tag/#add-event-parameters-from-datalayer) overrides [Standard parameters](#standard-request-payload)

### Add/override event level parameters
Add event level parameters in event_data object in the payload. Values accepted: strings, integers, float and json.

These parameters can override:
- default event parameters
- dataLayer event parameters added in Nameless Analytics Client-side tracker tag
- shared event parameters added in Nameless Analytics Client-side Configuration variable
- event parameters added in Nameless Analytics Client-side tracker tag

### Remove event level parameters
Remove event level parameters in event_data object in the payload. 



# Google BigQuery settings
## Project name
Google BigQuery's project name.


## Dataset name
Google BigQuery's Nameless Analytics dataset name.


## Table name
Google BigQuery's Nameless Analytics table name.



# Advanced settings
## Send data to custom endpoint
Send POST requests to custom endpoint with the same data loaded into Google BigQuery. 


## Change user cookie name
Change the user cookie name. Default name: nameless_analytics_user.


## Change session cookie name
Change the session cookie name. Default name: nameless_analytics_session.


## Change default session duration
Change the session duration in minutes. Default value: 30 min.


## Enable logs in preview mode 
Enable logs for all events in preview mode. 

Please note:  If cross-domain is enabled, all domains will send events in relative preview mode. For more information, see the Cross-domain section.



# Cookies
The cookies used by Nameless Analytics to manage users and sessions are configured with specific security attributes that ensure their proper functioning and privacy protection:

- HttpOnly: This attribute prevents cookies from being accessed via JavaScript in the browser. This reduces the risk of malicious scripts reading or modifying cookies, protecting sensitive data such as user and session identifiers.
- Secure: The cookie is sent only over secure HTTPS connections. This prevents interception of cookies on unsecured networks or man-in-the-middle attacks, enhancing the security of data transmission.
- SameSite=Strict: This attribute restricts the cookie to be sent only with requests originating from the same domain. Essentially, it prevents the cookie from being sent in cross-site contexts, blocking tracking attempts or attacks based on third-party requests (CSRF).

Together, these three attributes ensure that cookies are used securely, respecting user privacy and limiting misuse or unauthorized use of identifiers. 


## How cookies are set
When the server-side Google Tag Manager Client Tag receives the request, it checks if any cookies in there.
- If user and session cookies are missing in the request, Nameless Analytics Server-side client tag creates a user cookie and a session cookie.
- If user cookie is present but session cookie is not, Nameless Analytics Server-side client tag extends user cookie expiration and create a new session cookie.
- If the client and session cookies already exist, Nameless Analytics Server-side client tag extends user and session cookies expiration.

## Standard cookie values

| Default cookie name        | Example value                                   | Default exp. | Description                                                        |
|----------------------------|-------------------------------------------------|--------------|--------------------------------------------------------------------|
| nameless_analytics_user    | Lxt3Tvvy28gGcbp                                 | 400 days     | 15 chars random string                                             |
| nameless_analytics_session | Lxt3Tvvy28gGcbp_vpdXoWImLJZCoba-Np15ZLKO7SAk1WF | 30 minutes   | nameless_analytics_user + 15 chars random string + current page_id |

Cookie names and session default expiration can be customized in Nameless Analytics Server-Side client tag [advanced settings section](#advanced-settings).

Please note: 
  - the user cookie contains the client_id.
  - the session cookie contains the client_id, the session_id and the page_id of the last event. The actual session_id is the cookie value without the page_id.

---

Reach me at: [Email](mailto:hello@tommasomoretti.com) | [Website](https://tommasomoretti.com/?utm_source=github.com&utm_medium=referral&utm_campaign=nameless_analytics) | [Twitter](https://twitter.com/tommoretti88) | [Linkedin](https://www.linkedin.com/in/tommasomoretti/)
