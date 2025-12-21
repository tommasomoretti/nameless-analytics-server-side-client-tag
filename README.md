<img src="https://github.com/user-attachments/assets/93640f49-d8fb-45cf-925e-6b7075f83927#gh-light-mode-only" alt="Light Mode" />
<img src="https://github.com/user-attachments/assets/71380a65-3419-41f4-ba29-2b74c7e6a66b#gh-dark-mode-only" alt="Dark Mode" />

---

# Server-side client tag

The Nameless Analytics Server-side client tag is a highly customizable GTM custom template designed to claim and enhance requests from [Nameless Analytics Client-side tracker tag](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-tag/) and other sources.

For an overview of how Nameless Analytics works [start from here](https://github.com/tommasomoretti/nameless-analytics/).

Tag:
* [Client tag UI](#tag-ui)

Data:
* User data
  * [User parameters](#user-parameters)
    * [Add User ID](#add-user-id)
    * [Add/override user level parameters](#addoverride-user-level-parameters)
    * [Remove user level parameters](#remove-user-level-parameters)
* Session data
  * [Session parameters](#session-parameters)
    * [Add/override session level parameters](#addoverride-session-level-parameters)
    * [Remove session level parameters](#remove-session-level-parameters)
* Event data
  * [Event parameters](#event-parameters)
    * [Add/override event level parameters](#addoverride-event-level-parameters)
    * [Remove event level parameters](#remove-event-level-parameters)

Settings:
* Client settings
  * [Endpoint path](#endpoint-path)
  * [Accept requests from authorized domains only](#allowed-domains)
  * [Reject requests by IP](#reject-requests-by-ip)
* Google BigQuery settings
  * [Google BigQuery project ID](#project-name)
  * [Google BigQuery dataset ID](#dataset-name)
  * [Google BigQuery table ID](#table-name)
* Session settings
  * [Change user and session cookie prefix](#change-user-and-session-cookie-prefix) 
  * [Change default session duration](#change-default-session-duration)
* Advanced settings
   * [Send data to custom endpoint](#send-data-to-custom-endpoint)
   * [Enable logs in debug view](#enable-logs-in-debug-view)

</br>



## Tag UI

This is the UI of the Server-side client tag.

<img src="https://github.com/user-attachments/assets/08424656-e4ab-4f9d-a0c1-c4d8dd263f8a" alt="Nameless Analytics - Server-side client tag UI" />

</br>
</br>



## Basic settings
### Allowed domains

Set the specific domains from which requests can be claimed.

If the Server-side Google Tag Manager container needs to claim requests from multiple domains, all those domains must be listed in the "Allowed domains" field. Add one domain per row.

To ensure proper DNS resolution, the IP addresses of the Google App Engine or Cloud Run instances must be correctly associated with each respective domain name.

Follow these guides for:
- [Google App Engine standard environment](https://cloud.google.com/appengine/docs/standard/mapping-custom-domains)
- [Google App Engine flexible environment](https://cloud.google.com/appengine/docs/flexible/mapping-custom-domains)
- [Google Cloud Run](https://cloud.google.com/run/docs/mapping-custom-domains)

The container must be configured as well. Add the domains in the "Container settings" of the Server-side Google Tag Manager.

To select a domain for the preview mode, click the icon near the preview button and select a domain.


### Endpoint path

Endpoint path to which requests have to be sent.

</br>



## User data
### User parameters

Add user parameters for all events. The parameters will be added in the user_data object in the payload.

They are:
* written in Google Cloud Firestore every time they change --> latest values 
* read and sent to BigQuery with the current parameter status --> current values 

Please note: if a parameter has the same name as another, it can override or be overridden depending on where it was set. 

This is the hierarchy of event parameter importance: 

[Server side parameters](https://github.com/tommasomoretti/nameless-analytics-server-client-tracker-tag/#user-parameters) overrides [User parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-config-variable/#user-parameters)

#### Override user ID parameter

Override the user ID parameter in the `user_id` field. 

This parameter can override the [user ID](https://github.com/tommasomoretti/nameless-analytics-server-side-client-tag/#add-user-id) provided by the Nameless Analytics Client-side configuration variable.

#### Add/override user level parameters

Add user level parameters to the `user_data` object in the payload. Accepted values: strings, integers, floats, and JSON.

These parameters can override [user parameters](https://github.com/tommasomoretti/nameless-analytics-server-side-client-tag/#add-user-level-parameters) added in the Nameless Analytics Server-side client tag.

#### Remove user level parameters

Remove user level parameters in user_data object in the payload. 

</br>



## Session data
### Session parameters

Add session parameters for all events. The parameters will be added in the session_data object in the payload.

They are:
- written in Google Cloud Firestore every time they change --> latest values 
- read and sent to BigQuery with the current parameter status --> current values 

Please note: if a parameter has the same name as another, it can override or be overridden depending on where it was set. 

This is the hierarchy of event parameter importance: 
[Server side parameters](https://github.com/tommasomoretti/nameless-analytics-server-client-tracker-tag/#session-parameters) overrides [Session parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-config-variable/#session-parameters)

#### Add/override session level parameters

Add session level parameters to the `session_data` object in the payload. Accepted values: strings, integers, floats, and JSON.

These parameters can override [session parameters](https://github.com/tommasomoretti/nameless-analytics-server-side-client-tag/#add-session-level-parameters) added in the Nameless Analytics Server-side client tag.

#### Remove session level parameters

Remove session level parameters in session_data object in the payload. 

</br>



## Event data
### Event parameters

Add event parameters for all events. The parameters will be added in the event_data object in the payload.

Please note: if a parameter has the same name as another, it can override or be overridden depending on where it was set. 

This is the hierarchy of event parameter importance: 

[Server-side event parameters](https://github.com/tommasomoretti/nameless-analytics-server-side-client-tag/#event-parameters) overrides [Specific event parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-tag/#event-parameters) overrides [Shared event parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-config-variable/#add-shared-event-parameters) overrides [dataLayer parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-tag/#add-event-parameters-from-datalayer) overrides [Standard parameters](#standard-request-payload)

#### Add/override event level parameters

Add event level parameters to the `event_data` object in the payload. Accepted values: strings, integers, floats, and JSON.

These parameters can override:
- Default event parameters.
- dataLayer event parameters added in the Nameless Analytics Client-side tracker tag.
- Shared event parameters added in the Nameless Analytics Client-side configuration variable.
- Event parameters added in the Nameless Analytics Client-side tracker tag.

#### Remove event level parameters

Remove event level parameters in event_data object in the payload. 

</br>



## Google BigQuery settings
### Project name

Google BigQuery's project name.


### Dataset name

Google BigQuery's Nameless Analytics dataset name.


### Table name

Google BigQuery's Nameless Analytics table name.

</br>



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

---

Reach me at: [Email](mailto:hello@tommasomoretti.com) | [Website](https://tommasomoretti.com/?utm_source=github.com&utm_medium=referral&utm_campaign=nameless_analytics) | [Twitter](https://twitter.com/tommoretti88) | [LinkedIn](https://www.linkedin.com/in/tommasomoretti/)
