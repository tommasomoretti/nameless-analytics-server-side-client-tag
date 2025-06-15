![Na logo beta](https://github.com/tommasomoretti/nameless-analytics/assets/29273232/7d4ded5e-4b79-46a2-b089-03997724fd10)

---

# Server-side client tag
The Nameless Analytics Server-side client tag is a highly customizable GTM custom template designed to claim and enhance requests from the [Nameless Analytics Client-side tracker tag](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-tag).

For an overview of how Nameless Analytics works [start from here](https://github.com/tommasomoretti/nameless-analytics).

Start from here:
- [Server-side client tag UI](#tag-ui)
- Basic settings
  - [Allowed domains](#allowed-domains)
  - [Endpoint path](#endpoint-path)
- User data
  - [User level parameters](#user-level-parameters)
    - [Add/override user level parameters](#addoverride-user-level-parameters)
    - [Remove user level parameters](#remove-user-level-parameters)
- Session data
  - [Session level parameters](#session-level-parameters)
    - [Add/override session level parameters](#addoverride-session-level-parameters)
    - [Remove session level parameters](#remove-session-level-parameters)
- Event data
  - [Event level parameters](#event-level-parameters)
    - [Add/override event level parameters](#addoverride-event-level-parameters)
    - [Remove event level parameters](#remove-event-level-parameters)
- Google BigQuery settings
  - [Project ID](#project-id)
  - [Dataser ID](#dataser-id)
  - [Table ID](#table-id)
-  Advanced settings
   - [Change user cookie name](#change-user-cookie-name)
   - [Change session cookie name](#change-session-cookie-name)
   - [Change default session duration](#change-default-session-duration)
   - [Enable logs in debug view](#enable-logs-in-debug-view)
- [Cookies](#cookies)
- [Cross-domain](#cross-domain)



## Tag UI
This is the UI of the Server-side client tag.

![SS](https://github.com/user-attachments/assets/0e20ded7-6041-498a-b2d8-1d0de1bbdbdc)



## Basic settings
### Allowed domains
Lorem ipsum

### Endpoint path
Lorem ipsum



## User data
### User level parameters
Add user parameters for all events. The parameters will be added in the user object in the payload.

Please note: if a parameter has the same name as another, it can override or be overridden depending on where it was set. 

This is the hierarchy of event parameter importance: 
[Server side parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-tag/blob/main/README.md#addoverride-event-parameters) > [User parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-config-variable/blob/main/README.md#user-parameters)

#### Override user ID parameter
Lorem ipsum

#### Add/override user level parameters
Lorem ipsum

#### Remove user level parameters
Lorem ipsum



## Session data
### Session level parameters
#### Add/override session level parameters
Lorem ipsum

#### Remove session level parameters
Lorem ipsum



## Event data
### Event level parameters
#### Add/override event level parameters
Lorem ipsum

#### Remove event level parameters
Lorem ipsum




## Google BigQuery settings
### Project ID
Lorem ipsum


### Dataser ID
Lorem ipsum


### Table ID
Lorem ipsum



## Advanced settings
### Send data to custom endpoint
Lorem ipsum


### Change user cookie name
Change the user cookie name. Default name: nameless_analytics_user.


### Change session cookie name
Change the session cookie name. Default name: nameless_analytics_session.


### Change default session duration
Change the session duration in minutes. Default value: 30 min.


### Enable logs in debug view 
Lorem ipsum



## Cookies
When the server-side Google Tag Manager Client Tag receives the request, it checks if any cookies in there.
- If client and session cookies are missing in the request, The Nameless Analytics Server-side Client Tag creates a client cookie and a session cookie.
- If client cookie is present but session cookie is not, the Nameless Analytics Server-side Client Tag recreates a client cookie with the same value and create a new session cookie.
- If the client and session cookies already exist, the Nameless Analytics Server-side Client Tag recreates the two cookies with the same values.

### Standard cookie values

| Default cookie name        | Example value                                   | Default exp. | Description                                                        |
|----------------------------|-------------------------------------------------|--------------|--------------------------------------------------------------------|
| nameless_analytics_user    | Lxt3Tvvy28gGcbp                                 | 400 days     | 15 chars random string                                             |
| nameless_analytics_session | Lxt3Tvvy28gGcbp_vpdXoWImLJZCoba-Np15ZLKO7SAk1WF | 30 minutes   | nameless_analytics_user + 15 chars random string + current page_id |

Please note: the user cookie is used to store the client_id. The session cookie stores the session_id along with the page_id of the last event. The session_id corresponds to the session cookie value without the page_id.



## Cross-domain

---

Reach me at: [Email](mailto:hello@tommasomoretti.com) | [Website](https://tommasomoretti.com/?utm_source=github.com&utm_medium=referral&utm_campaign=nameless_analytics) | [Twitter](https://twitter.com/tommoretti88) | [Linkedin](https://www.linkedin.com/in/tommasomoretti/)
