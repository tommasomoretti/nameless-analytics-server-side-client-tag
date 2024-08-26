![Na logo beta](https://github.com/tommasomoretti/nameless-analytics/assets/29273232/7d4ded5e-4b79-46a2-b089-03997724fd10)


## Server-side client tag
Lorem ipsum


## Measurement Protocol
```bash
set full_endpoint="https://gtm.tommasomoretti.com/tm/nameless"
origin="https://tommasomoretti.com"
gtm_preview_header="ZW52LTEwMnxUWk9Pd1l1SW5YWFU0eFpzQlMtZHN3fDE5MThmMjVhMTQwNWViZjcwYmE5Yw==" 
payload='{
       "event_name": "pv",
       "event_timestamp": 123456789,
       "client_id": "4079777164",
       "session_id": "4079777164_8768230534",
       "from_measurement_protocol": "Yes",
       "event_data": {
         "page_id": "1105347900",
         "event_id": "1105347900_2273450297"
       }
     }'

curl -X POST $full_endpoint \
  -H "Content-Type: application/json" \
  -H "origin: $origin" \
  -H "X-Gtm-Server-Preview: $gtm_preview_header" \
  -d $payload
```


## Troubleshooting
Lorem ipsum


### Things to keep in mind

Lorem ipsum

---

Reach me at: [Email](mailto:hello@tommasomoretti.com) | [Website](https://tommasomoretti.com/?utm_source=github.com&utm_medium=referral&utm_campaign=nameless_analytics) | [Twitter](https://twitter.com/tommoretti88) | [Linkedin](https://www.linkedin.com/in/tommasomoretti/)
