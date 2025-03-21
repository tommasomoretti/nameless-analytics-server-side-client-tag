![Na logo beta](https://github.com/tommasomoretti/nameless-analytics/assets/29273232/7d4ded5e-4b79-46a2-b089-03997724fd10)

---

# Server-side client tag
The Nameless Analytics Server-side client tag is a highly customizable GTM custom template designed to claim and enhance requests from the [Nameless Analytics Client-side tracker tag](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-tag).

For an overview of how Nameless Analytics works [start from here](https://github.com/tommasomoretti/nameless-analytics).

Start from here:
- [Server-side client tag UI](#tag-ui)
- [Basic settings](#basic-settings)
  - [Allowed domains](#allowed-domains)
    - [Cross-domain](#cross-domain)
  - [Endpoint path](#endpoint-path)
- [Event data](#event-data)
  - [Event parameters](#event-parameters)
    - [Add/override event parameters](#addoverride-event-parameters)
    - [Remove parameters manually](#remove-parameters-manually)
    - [Modify user ID parameter](#modify-user-id-parameter)
- [Google BigQuery settings](#google-bigquery-settings)
  - [Project ID](#project-id)
  - [Dataser ID](#dataser-id)
  - [Table ID](#table-id)
-  [Advanced settings](#advanced-settings)
    - [Change user cookie name](#change-user-cookie-name)
    - [Change session cookie name](#change-session-cookie-name)
    - [Change default session duration](#change-default-session-duration)
    - [Enable logs in debug view](#enable-logs-in-debug-view)
- [Cookies](#cookies)



## Tag UI
This is the UI of the Server-side client tag.

<img width="609" alt="Screenshot 2025-03-17 alle 10 55 48" src="https://github.com/user-attachments/assets/68f3d69b-a112-4c22-97aa-41f49847398c" />



## Basic settings
### Allowed domains
Lorem ipsum

#### Cross-domain
Lorem ipsum

### Endpoint path
Lorem ipsum



## Event data
### Event parameters
#### Add/override event parameters
Lorem ipsum

#### Remove parameters manually
Lorem ipsum

#### Modify user ID parameter
Lorem ipsum



## Google BigQuery settings
### Project ID
Lorem ipsum


### Dataser ID
Lorem ipsum


### Table ID
Lorem ipsum



## Advanced settings
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

- If no cookies are present or the ```nameless_analytics_user``` cookie is not set but ```nameless_analytics_session cookie``` is set, the client tag generates generates two values, one for ```nameless_analytics_user``` cookie and one for ```nameless_analytics_session``` cookie), adds these values as event parameters and sets two cookies with the response.

- If the ```nameless_analytics_user``` cookie is set but ```nameless_analytics_session cookie``` is not (session expires), the client tag generates generates only one value for ```nameless_analytics_session``` cookie, adds that value to the hit, as event parameters, set again the same ```nameless_analytics_user``` cookie and set the ```nameless_analytics_session``` cookie with the response.

- If both cookies are present, the tag does not create any new cookies but adds their values to the hit.

#### Standard cookie values

| Default cookie name        | Example value                                   | Default exp. | Description                                                        |
|----------------------------|-------------------------------------------------|--------------|--------------------------------------------------------------------|
| nameless_analytics_user    | Lxt3Tvvy28gGcbp                                 | 400 days     | 15 chars random string                                             |
| nameless_analytics_session | Lxt3Tvvy28gGcbp_vpdXoWImLJZCoba-Np15ZLKO7SAk1WF | 30 minutes   | nameless_analytics_user + 15 chars random string + current page_id |

After that, the hit will be logged in a BigQuery event date partitioned table.

<img width="1512" alt="Nameless Analytics server-side logs" src="https://github.com/user-attachments/assets/225ae759-b4d8-4632-9ee8-b608fb5e4a12">

---

Reach me at: [Email](mailto:hello@tommasomoretti.com) | [Website](https://tommasomoretti.com/?utm_source=github.com&utm_medium=referral&utm_campaign=nameless_analytics) | [Twitter](https://twitter.com/tommoretti88) | [Linkedin](https://www.linkedin.com/in/tommasomoretti/)
