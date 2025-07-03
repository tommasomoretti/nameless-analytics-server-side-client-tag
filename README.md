<picture>
  <source srcset="https://github.com/user-attachments/assets/6af1ff70-3abe-4890-a952-900a18589590" media="(prefers-color-scheme: dark)">
  <img src="https://github.com/user-attachments/assets/9d9a4e42-cd46-452e-9ea8-2c03e0289006">
</picture>

---

# Server-side client tag
The Nameless Analytics Server-side client tag is a highly customizable GTM custom template designed to claim and enhance requests from the [Nameless Analytics Client-side tracker tag](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-tag/).

For an overview of how Nameless Analytics works [start from here](https://github.com/tommasomoretti/nameless-analytics/).

Table of contents:
- [Server-side client tag UI](#tag-ui)
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
- [Set Cookies](#cookies)
- [Receive cross-domain hits](#receive-cross-domain-hits)



## Tag UI
This is the UI of the Server-side client tag.

![Nameless Analytics - Server-side client tag UI](https://github.com/user-attachments/assets/0e20ded7-6041-498a-b2d8-1d0de1bbdbdc)



## Basic settings
### Allowed domains
Set the allowed domains from which requests can be claimed.

<img width="1800" alt="Screenshot 2025-07-03 alle 20 06 04" src="https://github.com/user-attachments/assets/e7089bdd-89ec-4348-b89a-0cf23865d22b" />


If Server-Side Google Tag Manager has to claim requests from different domains, all the domains must be allowed,

<img width="1800" alt="Screenshot 2025-07-03 alle 20 02 13" src="https://github.com/user-attachments/assets/6dc3e7bd-f89e-4bd7-baba-17c93735441e" />

mapped in Google App Engine or Google Cloud Run.

<img width="1800" alt="Screenshot 2025-06-17 alle 09 27 04" src="https://github.com/user-attachments/assets/97ab7224-444b-452e-a9f2-4a74b6a3104e" />

and the container must be configured as well.

<img width="1800" alt="Screenshot 2025-06-17 alle 09 22 28" src="https://github.com/user-attachments/assets/2ee51716-0fe4-42c2-b1e6-df5697c5809a" />

To select a domain for the preview mode, click the icon near the preview button

<img width="1800" alt="Screenshot 2025-06-17 alle 09 21 51" src="https://github.com/user-attachments/assets/6fd6d60e-34fc-4e90-86e1-7f53c915847f" />

and select a domain.

<img width="1800" alt="Screenshot 2025-06-17 alle 10 49 22" src="https://github.com/user-attachments/assets/f43322f8-f128-4a5a-8a1a-0fc3a9b75513" />


### Endpoint path
Endpoint path to which requests have to be sent.

<img width="1800" alt="Screenshot 2025-07-03 alle 20 04 02" src="https://github.com/user-attachments/assets/cf3e9cf0-3634-4ce1-a25f-c94bc576ff87" />



## User data
### User parameters
Add user parameters for all events. The parameters will be added in the user_data object in the payload.

They are:
- written in Google Cloud Firestore every time they change --overrides latest update 
- read and sent to BigQuery with the current parameter status --overrides every update

Please note: if a parameter has the same name as another, it can override or be overridden depending on where it was set. 

This is the hierarchy of event parameter importance: 

[Server side parameters](https://github.com/tommasomoretti/nameless-analytics-server-client-tracker-tag/#user-parameters) overrides [User parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-config-variable/#user-parameters)

#### Override user ID parameter
Override User ID parameters in user_id field. 

This parameter can override [users ID](https://github.com/tommasomoretti/nameless-analytics-server-side-client-tag/#add-user-id) added in Nameless Analytics Client-Side configuration variable.


#### Add/override user level parameters
Add user level parameters in user_data object in the payload. Values accepted: strings, integers, float and json.

These parameter can override [user parameters]([url](https://github.com/tommasomoretti/nameless-analytics-server-side-client-tag/#add-user-level-parameters)) added in Nameless Analytics Server-side client tag.

#### Remove user level parameters
Remove user level parameters in user_data object in the payload. 



## Session data
### Session parameters
Add session parameters for all events. The parameters will be added in the session_data object in the payload.

They are:
- written in Google Cloud Firestore every time they change --overrides latest update 
- read and sent to BigQuery with the current parameter status --overrides every update

Please note: if a parameter has the same name as another, it can override or be overridden depending on where it was set. 

This is the hierarchy of event parameter importance: 
[Server side parameters](https://github.com/tommasomoretti/nameless-analytics-server-client-tracker-tag/#session-parameters) overrides [Session parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-config-variable/#session-parameters)

#### Add/override session level parameters
Add session level parameters in session_data object in the payload. Values accepted: strings, integers, float and json.

These parameter can override [session parameters]([url](https://github.com/tommasomoretti/nameless-analytics-server-side-client-tag/#add-session-level-parameters)) added in Nameless Analytics Server-side client tag.

#### Remove session level parameters
Remove session level parameters in session_data object in the payload. 



## Event data
### Event parameters
Add event parameters for all events. The parameters will be added in the event_data object in the payload.

Please note: if a parameter has the same name as another, it can override or be overridden depending on where it was set. 

This is the hierarchy of event parameter importance: 

[Server-side event parameters](https://github.com/tommasomoretti/nameless-analytics-server-side-client-tag/#event-parameters) overrides [Specific event parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-tag/#event-parameters) overrides [Shared event parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-config-variable/#add-shared-event-parameters) overrides [dataLayer parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-tag/#add-event-parameters-from-datalayer) overrides [Standard parameters](#standard-payload)

#### Add/override event level parameters
Add event level parameters in event_data object in the payload. Values accepted: strings, integers, float and json.

These parameters can override:
- default event parameters
- dataLayer event parameters added in Nameless Analytics Client-side tracker tag
- shared event parameters added in Nameless Analytics Client-side Configuration variable
- event parameters added in Nameless Analytics Client-side tracker tag

#### Remove event level parameters
Remove event level parameters in event_data object in the payload. 



## Google BigQuery settings
### Project name
Google BigQuery's project name.


### Dataset name
Google BigQuery's Nameless Analytics dataset name.


### Table name
Google BigQuery's Nameless Analytics table name.



## Advanced settings
### Send data to custom endpoint
Send POST requests to custom endpoint with the same data loaded into Google BigQuery. 


### Change user cookie name
Change the user cookie name. Default name: nameless_analytics_user.


### Change session cookie name
Change the session cookie name. Default name: nameless_analytics_session.


### Change default session duration
Change the session duration in minutes. Default value: 30 min.


### Enable logs in preview mode 
Enable logs for all events in preview mode. 

Please note:  If cross-domain is enabled, all domains will send events in relative preview mode. For more information, see the Cross-domain section.



## Cookies
All cookies are served as HttpOnly, secure, sameSite=Strict. 

When the server-side Google Tag Manager Client Tag receives the request, it checks if any cookies in there.
- If client and session cookies are missing in the request, Nameless Analytics Server-side client tag creates a client cookie and a session cookie.
- If client cookie is present but session cookie is not, Nameless Analytics Server-side client tag recreates a client cookie with the same value and create a new session cookie.
- If the client and session cookies already exist, Nameless Analytics Server-side client tag recreates the two cookies with the same values.

### Standard cookie values

| Default cookie name        | Example value                                   | Default exp. | Description                                                        |
|----------------------------|-------------------------------------------------|--------------|--------------------------------------------------------------------|
| nameless_analytics_user    | Lxt3Tvvy28gGcbp                                 | 400 days     | 15 chars random string                                             |
| nameless_analytics_session | Lxt3Tvvy28gGcbp_vpdXoWImLJZCoba-Np15ZLKO7SAk1WF | 30 minutes   | nameless_analytics_user + 15 chars random string + current page_id |

Please note: 
  - the user cookie contains the client_id.
  - the session cookie contains the client_id, the session_id and the page_id of the last event. The actual session_id is the cookie value without the page_id.

---

Reach me at: [Email](mailto:hello@tommasomoretti.com) | [Website](https://tommasomoretti.com/?utm_source=github.com&utm_medium=referral&utm_campaign=nameless_analytics) | [Twitter](https://twitter.com/tommoretti88) | [Linkedin](https://www.linkedin.com/in/tommasomoretti/)
