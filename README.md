<img src="https://github.com/user-attachments/assets/93640f49-d8fb-45cf-925e-6b7075f83927#gh-light-mode-only" alt="Light Mode" />
<img src="https://github.com/user-attachments/assets/71380a65-3419-41f4-ba29-2b74c7e6a66b#gh-dark-mode-only" alt="Dark Mode" />

---

# Nameless Analytics Server-side Client Tag

The Nameless Analytics Server-side Client Tag is a highly customizable GTM custom template designed to claim and enhance requests from [Nameless Analytics Client-side Tracker Tag](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-tag/) and other sources.

For an overview of how Nameless Analytics works [start from here](https://github.com/tommasomoretti/nameless-analytics/).

Tag:
* [Nameless Analytics Server-side Client Tag UI](#tag-ui)

Data:
* User data
  * [User parameters](#user-parameters)
    * [Add/override user level parameters](#addoverride-user-level-parameters)
    * [Remove user level parameters](#remove-user-level-parameters)
* Session data
  * [Session parameters](#session-parameters)
    * [Add/override user ID](#addoverride-user-id)
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
  * [Change user cookie name](#change-user-cookie-name)
  * [Change session cookie name](#change-session-cookie-name)
  * [Change default session duration](#change-default-session-duration)
* Advanced settings
   * [Send data to custom endpoint](#send-data-to-custom-endpoint)
   * [Enable logs in preview mode](#enable-logs-in-preview-mode)

</br>



## Tag UI

This is the UI of the Nameless Analytics Server-side Client Tag.

<img src="https://github.com/user-attachments/assets/107f068c-6e92-4c97-8011-d5f0a39eb7a3" alt="Nameless Analytics Server-side Client Tag UI" />

</br>
</br>



## User data
### User parameters

Add user parameters for all events. The parameters will be added in the user_data object in the payload.

They are:
* written in Google Cloud Firestore every time they change --> latest values 
* read and sent to BigQuery with the current parameter status --> current values 

Please note: if a parameter has the same name as another, it can override or be overridden depending on where it was set. 

This is the hierarchy of event parameter importance: 

[Server-side user parameters](#user-parameters) override [User parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-configuration-variable/#user-parameters)

#### Add/override user level parameters

Add user level parameters to the `user_data` object in the payload. Accepted values: strings, integers, floats, and JSON.

These parameters can override [user parameters](#addoverride-user-level-parameters) added in the Nameless Analytics Server-side Client Tag.

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

[Server-side session parameters](#session-parameters) override [Session parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-configuration-variable/#session-parameters)

#### Add/override user ID parameter

Add or override the user ID parameter in the `user_id` field. 

This parameter can override the [user ID](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-configuration-variable/#add-user-id) provided by the Nameless Analytics Client-side Tracker Configuration Variable.

#### Add/override session level parameters

Add session level parameters to the `session_data` object in the payload. Accepted values: strings, integers, floats, and JSON.

These parameters can override [session parameters](#addoverride-session-level-parameters) added in the Nameless Analytics Server-side Client Tag.

#### Remove session level parameters

Remove session level parameters in session_data object in the payload. 

</br>



## Event data
### Event parameters

Add event parameters for all events. The parameters will be added in the event_data object in the payload.

Please note: if a parameter has the same name as another, it can override or be overridden depending on where it was set. 

This is the hierarchy of event parameter importance: 

[Server-side event parameters](#event-parameters) override [Specific event parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-tag/#addoverride-event-level-parameters) override [Shared event parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-configuration-variable/#add-shared-event-parameters) override [dataLayer parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-tag/#add-event-parameters-from-datalayer) override [Standard parameters](https://github.com/tommasomoretti/nameless-analytics-client-side-tracker-tag/#request-payload-data)

#### Add/override event level parameters

Add event level parameters to the `event_data` object in the payload. Accepted values: strings, integers, floats, and JSON.

These parameters can override:
- Default event parameters.
- dataLayer event parameters added in the Nameless Analytics Client-side Tracker Tag.
- Shared event parameters added in the Nameless Analytics Client-side Tracker Configuration Variable.
- Event parameters added in the Nameless Analytics Client-side Tracker Tag.

#### Remove event level parameters

Remove event level parameters in event_data object in the payload. 

</br>



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

</br>



## Google BigQuery settings
### Project name
The unique ID of the Google Cloud Project.

### Dataset name
The ID of the BigQuery dataset where Nameless Analytics will store its tables. This dataset must be created before the tag can write data.

### Table name
The name of the main raw events table. By default, this is set to `events_raw`.

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
