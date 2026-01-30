# Nsq-To-Opensearch

Example of a docker compose that starts OpenSearch services and the 'nsq-to-opensearch' application, which processes logs in an 'organized' way.

In the test service, there is an example of log sending.
The first argument 'log-json' is a 'key' word used in the 'nsq-to-opensearch' service to split logs from different 'topics', which are determined by the 'topic' field (see example below).
Another required field for correct operation of OpenSearch is a timestamp field (in the example below defined as 'timestamp').
All other fields are optional for the user.

```JS
publish('log-json', {
  topic: 'user-activity',
  event: 'user_signin',
  user: {
    id: 123,
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  opId: uuidv4(),
  timestamp: new Date().toISOString(),
});
```

# test / usage

Starting the OpenSearch dashboards services

```sh
docker compose up nsq-to-opensearch
```

Starting the 'test' service to stimulate log generation

```sh
docker compose up test
```

If desired, you can run the 'nsqadmin' service to analyze the NSQ queues

```sh
docker compose up nsqadmin
```

To stop all

```sh
docker compose down
```
