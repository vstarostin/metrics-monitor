# POC System for IOT devices monitoring

## Implementation of system for monitoring and collecting metrics of devices that receive data such as temperature, noisiness and humidity.


Web-server gives REST API for devices control

- Create
- Delete
- Receive metrics

## API

Specification are described in OpenAPI format, reference <br />
https://github.com/vstarostin/metrics-monitor/blob/main/api/api.yaml

### Run app
<hr>

For build web-server and client require install Docker and docker-compose

Command builds server and client and starting them

```sh
docker-compose up 
```
