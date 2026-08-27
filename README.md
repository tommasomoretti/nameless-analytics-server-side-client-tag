# Nameless Analytics | Server-side Client Tag

The Nameless Analytics Server-side Client Tag is a highly customizable GTM custom template designed to claim and enhance requests from [Nameless Analytics Client-side Tracker Tag](https://github.com/nameless-analytics/client-side-tracker-tag/) and other sources.

For an overview of how Nameless Analytics works [start from here](https://github.com/nameless-analytics/nameless-analytics/#overview).


### 🚧 Nameless Analytics and the documentation are currently in beta and subject to change



## Table of Contents

- [Nameless Analytics Server-side Client Tag UI](#nameless-analytics-server-side-client-tag-ui)
- [User data](#user-data)
  - [User parameters](#user-parameters)
    - [Add/override user level parameters](#addoverride-user-level-parameters)
    - [Remove user level parameters](#remove-user-level-parameters)
- [Session data](#session-data)
  - [Session parameters](#session-parameters)
    - [Add/override User ID parameter](#addoverride-user-id-parameter)
    - [Add/override session level parameters](#addoverride-session-level-parameters)
    - [Remove session level parameters](#remove-session-level-parameters)
- [Event data](#event-data)
  - [Event parameters](#event-parameters)
    - [Add/override event level parameters](#addoverride-event-level-parameters)
    - [Remove event level parameters](#remove-event-level-parameters)
- [Client settings](#client-settings)
  - [Endpoint path](#endpoint-path)
  - [Accept requests from authorized domains only](#accept-requests-from-authorized-domains-only)
  - [Reject requests by IP](#reject-requests-by-ip)
  - [Enable Bot protection](#enable-bot-protection)
  - [Request body validation](#request-body-validation)
  - [Cross-domain ID validation](#cross-domain-id-validation)
  - [API key for Streaming Protocol requests](#api-key-for-streaming-protocol-requests)
- [Google BigQuery settings](#google-bigquery-settings)
  - [Google BigQuery project ID](#google-bigquery-project-id)
  - [Google BigQuery dataset ID](#google-bigquery-dataset-id)
  - [Google BigQuery table ID](#google-bigquery-table-id)
- [Session settings](#session-settings)
  - [Change user and session cookie prefix](#change-user-and-session-cookie-prefix)
  - [Change default session duration](#change-default-session-duration)
- [Advanced settings](#advanced-settings)
  - [Send data to custom endpoint](#send-data-to-custom-endpoint)
  - [Enable logs in debug view](#enable-logs-in-debug-view)
- [Verifying the setup](#verifying-the-setup)
- [Troubleshooting](#troubleshooting)



## Nameless Analytics Server-side Client Tag UI
The Nameless Analytics Server-side Client Tag serves as the secure, high-performance gateway for your data infrastructure.

It is responsible for validating incoming requests, enriching payloads with Firestore data, and routing verified events to BigQuery and external endpoints.

This is the UI of the Nameless Analytics Server-side Client Tag.

![Nameless Analytics Server-side Client Tag UI](https://github.com/user-attachments/assets/0ae82d69-d89d-43ad-97cf-64330af205ed)



## User data
### User parameters
Add, override or remove user parameters in the user_data object. See [Parameter Hierarchy](https://github.com/nameless-analytics/nameless-analytics/#parameter-hierarchy) in the main project documentation.

> [!WARNING]
> Be mindful when adding custom **User parameters** as they might cause you to hit the Firestore 1 MiB document limit faster. Read the [Firestore limitations in the main documentation](https://github.com/nameless-analytics/nameless-analytics#known-limitations-firestore-1-mib-document-limit) for more details.

They will be:
- written in Google Cloud Firestore every time they change --> latest values
- sent to BigQuery with the last available values --> all values

These user parameters are reserved and can't be modified:
- user_date
- client_id
- user_channel_grouping
- user_source
- user_tld_source
- user_campaign
- user_campaign_id
- user_campaign_click_id
- user_campaign_content
- user_campaign_term
- user_device_type
- user_country
- user_city
- user_language
- user_first_session_timestamp
- user_last_session_timestamp

#### Add/override user level parameters
Add or override parameters at user level. Accepted values: strings, integers, floats, JSON and booleans.

These parameters can override:
- User parameters added in Nameless Analytics Client-side Tracker Configuration Variable

#### Remove user level parameters
Remove user level parameters in user_data object in the payload.

These parameters can remove:
- User parameters added in Nameless Analytics Client-side Tracker Configuration Variable



## Session data
### Session parameters
Add, override or remove session parameters in the session_data object. See [Parameter Hierarchy](https://github.com/nameless-analytics/nameless-analytics/#parameter-hierarchy) in the main project documentation.

> [!WARNING]
> Be mindful when adding custom **Session parameters** as they might cause you to hit the Firestore 1 MiB document limit faster. Read the [Firestore limitations in the main documentation](https://github.com/nameless-analytics/nameless-analytics#known-limitations-firestore-1-mib-document-limit) for more details.

They will be:
- written in Google Cloud Firestore every time they change --> latest values
- sent to BigQuery with the last available values --> all values

These session parameters are reserved and can't be modified:
- session_date
- session_id
- user_id
- session_number
- cross_domain_session
- session_channel_grouping
- session_source
- session_tld_source
- session_campaign
- session_campaign_id
- session_campaign_click_id
- session_campaign_term
- session_campaign_content
- session_device_type
- session_country
- session_city
- session_language
- session_hostname
- session_browser_name
- session_landing_page_category
- session_landing_page_url
- session_landing_page_path
- session_landing_page_title
- session_exit_page_category
- session_exit_page_url
- session_exit_page_path
- session_exit_page_title
- session_start_timestamp
- session_end_timestamp

#### Add/override User ID parameter
Add or override User ID parameter at session level. Accepted values: strings, integers, floats, JSON and booleans.

These parameters can override:
- User ID parameter added in Nameless Analytics Client-side Tracker Configuration Variable

#### Add/override session level parameters
Add or override session level parameters. Accepted values: strings, integers, floats, JSON and booleans.

These parameters can override:
- Session parameters added in Nameless Analytics Client-side Tracker Configuration Variable

#### Remove session level parameters
Remove session level parameters in session_data object in the payload.

These parameters can remove:
- Session parameters added in Nameless Analytics Client-side Tracker Configuration Variable



## Event data
### Event parameters
Add, override or remove event parameters in the event_data object. See [Parameter Hierarchy](https://github.com/nameless-analytics/nameless-analytics/#parameter-hierarchy) in the main project documentation.

They will be sent to BigQuery with every event.

These event parameters are reserved and can't be modified:
- event_type
- channel_grouping
- source
- campaign
- campaign_id
- campaign_click_id
- campaign_term
- campaign_content
- user_agent
- browser_name
- browser_language
- browser_version
- device_type
- device_vendor
- device_model
- os_name
- os_version
- screen_size
- viewport_size
- tld_source
- city
- country
- cross_domain_id

#### Add/override event level parameters
Add or overwrite parameters for a specific event. Accepted values: strings, integers, floats, JSON and booleans.

These parameters can override:
- Event parameters added in the Nameless Analytics Client-side Tracker Tag
- Shared event parameters added in the Nameless Analytics Client-side Tracker Configuration Variable
- Event parameters from dataLayer added in the Nameless Analytics Client-side Tracker Tag

#### Remove event level parameters
Remove event level parameters by name in event_data object in the payload.

These parameters can remove:
- Event parameters added in the Nameless Analytics Client-side Tracker Tag
- Shared event parameters added in the Nameless Analytics Client-side Tracker Configuration Variable
- Event parameters from dataLayer added in the Nameless Analytics Client-side Tracker Tag



## Client settings
### Endpoint path
The request endpoint path the tag listens on. It must start with `/` and must not end with `/`.

A server-side container can run several clients, each listening on its own path, and every incoming request goes to the client that claims it. This tag claims a request only when its path matches this value exactly, which has two consequences:

- it must be identical to the **Endpoint path** set in the [Client-side Tracker Configuration Variable](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#endpoint-path), otherwise the requests reach the container but this client never takes them;
- it should not overlap with the path claimed by any other client in the same container, so give Nameless Analytics a dedicated one (e.g. `/na/collect`).


### Accept requests from authorized domains only
Set the specific domains from which requests can be claimed.

The option sits under **Client settings** → **Security rules**. If the Server-side Google Tag Manager container needs to claim requests from multiple domains, all those domains must be listed in the **Authorized domains** table. Add one domain per row.

> [!IMPORTANT]
> **The option is off by default, and while it is off every origin is accepted.** The check compares the Effective TLD+1 of the request `Origin` header with the configured list: with no list to compare against, the tag matches the request against itself and always claims it. Anyone who knows your endpoint path can send events from any website, and they are stored like any other event. Turn the option on and list your domains for any production container. The GTM server debug view reports the current state as `👉 Authorized origins: All` or as the list of domains.

Add domains as bare host names, without protocol: `www.yourdomain.com`, not `https://www.yourdomain.com`. Only the Effective TLD+1 is compared, so a single entry covers every subdomain of that domain.

Two consequences worth knowing before enabling it:

- requests without an `Origin` header are rejected. Browsers always send it on the tracker's `fetch` calls, but server-to-server calls do not unless you add it: the [Streaming Protocol](https://github.com/nameless-analytics/nameless-analytics/tree/main/streaming-protocol) scripts set `Origin` explicitly for this reason, and any custom backend implementation must do the same;
- in a cross-domain setup, every domain involved must be listed, otherwise the requests coming from the other sites are refused with `🔴 Request origin not authorized`.


### Reject requests by IP
Reject requests coming from specific IP addresses. The option sits under **Client settings** → **Security rules**.

Add one address per row in the **Banned IPs** table, under the **Internet Protocol address** column. Both IPv4 and IPv6 are accepted, and the field validation rejects anything that is not a well-formed address.


### Enable Bot protection
The option sits under **Client settings** → **Security rules**.

If enabled, the Nameless Analytics Server-side Client Tag filters requests based on a predefined blacklist of values in the `User-Agent` header:
- **HTTP Libraries:** `curl`, `wget`, `python`, `requests`, `httpie`, `go-http-client`, `java`, `okhttp`, `libwww`, `perl`, `axios`, `node`, `fetch`, `php`, `guzzle`, `ruby`, `faraday`, `rest-client`.
- **AI Agents & LLMs:** `gptbot`, `chatgpt`, `anthropic`, `claude`, `perplexity`, `bytespider`, `ccbot`.
- **SEO & Marketing Bots:** `ahrefs`, `semrush`, `dotbot`, `mj12`, `rogerbot`, `bot`, `crawler`, `spider`, `scraper`.
- **Automation & Security:** `nmap`, `zgrab`, `masscan`, `shodan`, `headless`, `phantomjs`, `selenium`, `puppeteer`, `playwright`, `cypress`, `electron`.

Two further `User-Agent` checks run **regardless of this option** and cannot be turned off:

- a request with a missing or empty `User-Agent` header is always rejected;
- a request declaring `event_origin: "Streaming Protocol"` is always rejected unless its `User-Agent` is exactly `Nameless Analytics - Streaming Protocol`. The comparison ignores case but is otherwise exact: any prefix or suffix fails it. See the [Streaming Protocol documentation](https://github.com/nameless-analytics/nameless-analytics/tree/main/streaming-protocol).

Both are rejected with `403 Forbidden` and the same message as a blacklisted agent.


### Request body validation
The request body must contain a valid JSON object. A missing body, malformed JSON, a JSON array, or a primitive JSON value is rejected with `400 Bad Request` before the GTM container runs. Firestore, BigQuery, and custom endpoint forwarding are all skipped.


### Cross-domain ID validation
When cross-domain tracking is enabled, the destination page sends the originating `session_id` in the payload as `cross_domain_id`. Since that value travels through a URL parameter, the Server-side Client Tag validates its format before using it as an identity.

A value is accepted only if it matches the format of a server-issued `session_id`: 15 alphanumeric characters, an underscore, 15 alphanumeric characters.

Values that do not match are **discarded, not rejected**: the event is still claimed and stored, and is attributed using the local `na_u` and `na_s` cookies as if no cross-domain ID had been sent — in the typical case, a new session. The following message is logged in GTM Server Preview:

```text
🟠 Invalid cross-domain ID format. Value ignored.
```

This behaviour is intentional. A stale or broken link on a partner site degrades to a new session instead of costing you the visit, while a malformed value can never reach the cookies or the Firestore document path.

No configuration is required: the check is always active.


### API key for Streaming Protocol requests
Secure the Streaming Protocol (Measurement Protocol) endpoint by requiring a secret API key.

Any request where `event_origin` is set to `Streaming Protocol` is rejected unless it includes an `X-Api-Key` header matching the configured value. There is no bypass: enable **"Add API key for Streaming Protocol"** and set a key before sending events from a backend.

Requests with `event_origin` set to `Website` are not affected by this setting, ensuring seamless browser tracking without the need for additional headers or CORS preflight requests.

The [Nameless Analytics Streaming Protocol](https://github.com/nameless-analytics/nameless-analytics/tree/main/streaming-protocol) allows you to send data from your backend directly to the Nameless Analytics Server-side Client Tag endpoint.



## Google BigQuery settings
### Google BigQuery project ID
The unique ID of the Google Cloud project that holds the dataset.


### Google BigQuery dataset ID
The ID of the BigQuery dataset where Nameless Analytics will store its tables. The dataset must be created before the tag can write data.


### Google BigQuery table ID
The ID of the main raw events table. Create it using the DML query in the [Create raw tables](https://github.com/nameless-analytics/nameless-analytics/blob/main/tables/TABLES.md#create-raw-tables) section before you start sending events.

The setup script creates the table as `events_raw`, and the table functions that read the raw table expect that name, so use a different one only if you also update them.

All three fields are required and start empty: the tag will not save until each one has a value.



## Session settings
### Change user and session cookie prefix
Override the default name of the user and session cookies. When enabled, set the new prefix in the **Cookie prefix** field.

Default prefix: `na_u` and `na_s`. See [Server-side cookies](https://github.com/nameless-analytics/nameless-analytics/#server-side-cookies) for more information.


### Change default session duration
Override the default duration of the session cookie. When enabled, set the new value, in minutes, in the **Session duration** field.

Default value: 30 minutes.



## Advanced settings
### Send data to custom endpoint
Send POST requests to custom endpoint with the same data loaded into Google BigQuery.

Set the destination in **Full endpoint domain path**: unlike the other domain fields of the platform, this one is a complete URL and must start with `https://`.

To authenticate the call, check **Add custom request headers** and fill in the **Custom request headers** table, which has a **Header name** and a **Header value** column. Credentials set here never reach the browser, since the request leaves from your server-side container.


### Enable logs in debug view
Enable logs for all events in the GTM server debug view. The Client-side Tracker Tag logs to the browser JavaScript console, this tag logs here.

If cross-domain is enabled, all cross-domain requests will be visible in each domain's respective debug view. For more information, see the [Cross-domain section](https://github.com/nameless-analytics/client-side-tracker-configuration-variable/#enable-cross-domain-tracking).



## Verifying the setup
When logs are enabled in the [Advanced settings](#enable-logs-in-debug-view), you can verify that the tag is processing events correctly by checking the GTM server debug view.

The following success messages indicate a correct implementation and data delivery:

| **Scope** | **Message** | **Description** |
|:---|:---|:---|
| Data validation | 🟢 Request correct | The incoming request passed all validation checks |
| | 🟢 Request processed successfully | Final success message for a fully processed event, returned with `status_code: 200` once Firestore, BigQuery and the custom endpoint have all completed |
| Cross-domain | 🟢 Request correct, user and session cookies found. Cross-domain URL decoration will be applied | Success log for `get_user_data` cross-domain requests |
| | 🟢 Request claimed successfully | Success message of a `get_user_data` request. Cross-domain handshakes end here: they are answered with the identifiers and never reach Firestore or BigQuery |
| User & Session | 👉 Same client_id, same session_id | Confirms cookie refresh for active user and session |
| | 👉 Returning user, no active session | Confirms session initialization for returning user |
| | 👉 New user, no active session | Confirms new user and session identifier generation |
| Data storage | 🟢 User successfully created in Firestore, session successfully added to Firestore | Confirmation that a new user and their first session were persisted |
| | 🟢 User already in Firestore, session successfully added to Firestore | Confirmation that a new session was added to an existing user |
| | 🟢 User already in Firestore, session successfully updated to Firestore | Confirmation that an existing session was refreshed |
| | 🟢 Payload data inserted successfully into BigQuery | Confirmation that the event was pushed to BigQuery |
| | 🟢 Request sent successfully to: [URL] | Forwarded successfully to a custom endpoint |



## Troubleshooting
If you encounter any issues or see 🔴 error messages in the console, please refer to the [Troubleshooting Guide](https://github.com/nameless-analytics/nameless-analytics/blob/main/setup-guides/TROUBLESHOOTING-GUIDE.md).

#

[Website](https://namelessanalytics.com/?utm_source=github.com&utm_medium=referral&utm_campaign=nameless_analytics_server_side_client_tag_readme) | [Twitter](https://x.com/nmlssanalytics) | [LinkedIn](https://www.linkedin.com/company/nameless-analytics/)
