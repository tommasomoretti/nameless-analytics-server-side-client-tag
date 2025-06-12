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
- Event data
  - [Event parameters](#event-parameters)
    - [Add/override event parameters](#addoverride-event-parameters)
    - [Remove parameters manually](#remove-parameters-manually)
    - [Modify user ID parameter](#modify-user-id-parameter)
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

<img width="1265" alt="Screenshot 2025-06-03 alle 15 43 44" src="https://github.com/user-attachments/assets/abe898b5-4c30-46b9-abeb-489081d64b7c" />



## Basic settings
### Allowed domains
Lorem ipsum

### Endpoint path
Lorem ipsum



## Event data
### Event parameters
#### Add/override event parameters
Lorem ipsum

#### Remove parameters manually
Lorem ipsum

#### Override user ID parameter
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
Lorem ipsum


### Change session cookie name
Lorem ipsum


### Change default session duration
Lorem ipsum


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

Please note: The actual session_id is without the current page_id wich.  



## Cross-domain

---

Reach me at: [Email](mailto:hello@tommasomoretti.com) | [Website](https://tommasomoretti.com/?utm_source=github.com&utm_medium=referral&utm_campaign=nameless_analytics) | [Twitter](https://twitter.com/tommoretti88) | [Linkedin](https://www.linkedin.com/in/tommasomoretti/)
