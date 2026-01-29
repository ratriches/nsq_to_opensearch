// example of usage/sending messages to NSQ, to be viewed in the OpenSearch dashboard

const { v4: uuidv4 } = require('uuid');
const nsqHelper = require('./nsq-helper');
const { sleep } = require('./sleep');

const nsqCfg = {
  host: 'nsqd',
  port: 4150,
  timeout: 300000,
  republishTime: 2000,
};

const publish = (topic, msgData) => {
  const msg = JSON.stringify(msgData);
  console.log(`Publishing to topic ${topic}: ${msg}`);
  return nsqHelper.publish(topic, msg);
};

const start = async () => {
  await nsqHelper.init(nsqCfg);

  await nsqHelper.waitConnect(10000);
};

const sendLogs = async () => {
  await sleep(100);

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

  await sleep(1000);

  publish('log-json', {
    topic: 'user-activity',
    event: 'user_signout',
    user: {
      id: 123,
      name: 'John Foo',
      email: 'john.foo@example.com',
    },
    opId: uuidv4(),
    timestamp: new Date().toISOString(),
  });
};

start();

setInterval(async () => {
  await sendLogs();
}, 10000);
