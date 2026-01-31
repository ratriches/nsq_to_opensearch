
# NSQ to OpenSearch

This project provides a Docker Compose setup to launch OpenSearch services and the `nsq-to-opensearch` application, which processes logs in an organized way.

## Log Example
In the test service, you can find an example of log sending.
The first argument, `'log-json'`, is a keyword used by the `nsq-to-opensearch` service to separate logs from different topics, determined by the `topic` field (see example below).
Another required field for correct operation with OpenSearch is a `timestamp` field (as shown below).
All other fields are optional.

```js
// Example log message
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

## Usage

1. **Build the services (optional, for first-time setup or after changes):**
   ```sh
   docker compose build
   ```
2. **Start the OpenSearch and nsq-to-opensearch services:**
   ```sh
   docker compose up nsq-to-opensearch
   ```
3. **Start the test service to generate logs:**
   ```sh
   docker compose up test
   ```

## More Information
For detailed explanations and screenshots, see [docs/imagesExplain.md](docs/imagesExplain.md).

If desired, you can run the 'nsqadmin' service to analyze the NSQ queues
```sh
docker compose up nsqadmin
```

To stop all
```sh
docker compose down
```

# troubleshooting

If some service, like 'opensearch' or 'opensearch-dashdoards' don´t start correctly, check the 'persistence' and sub directories owner (for example)

# More 'nsq-to-opensearch' Information
For detailed explanations, see [nsq-to-opensearch/ReadMe.md](nsq-to-opensearch/ReadMe.md).