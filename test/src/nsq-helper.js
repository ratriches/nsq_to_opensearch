const nsq = require('nsqjs');

const modName = 'NsqHlp';

module.exports = {
  state: 'awaiting',

  expires: null,

  async init({ host, port, timeout, republishTime }) {
    if (!host) return Promise.reject(new Error('Missing Host'));
    if (!port) return Promise.reject(new Error('Missing Port'));
    if (!timeout) return Promise.reject(new Error('Missing Timeout'));
    if (!republishTime) return Promise.reject(new Error('Missing Republish Time'));

    this.host = host;
    this.port = port;
    this.timeout = timeout;
    this.republishTime = republishTime;
    this.publisher = new nsq.Writer(this.host, this.port);
    this.connect();

    this.publisher.on('ready', () => {
      console.log(modName, `Connected on host [${host}:${port}]`, { toKib: true, toCsl: true });
      this.state = 'connected';
    });

    this.publisher.on('closed', () => {
      console.log(modName, `Closed the connection [${host}:${port}]`, { toKib: true });
      this.state = 'closed';
      this.connect();
    });

    this.publisher.on('error', (error) => {
      console.log(modName, `Error on host [${host}:${port}] ${error}`, { toKib: true });
      this.state = 'error';
      this.connect();
    });

    return Promise.resolve();
  },

  isConnected() {
    return this.state === 'connected';
  },

  async waitConnect(tout) {
    const step = 50;
    const checkState = () =>
      new Promise((res) => {
        setTimeout(() => res(this.state !== 'connected'), step);
      });

    if (!this.isConnected()) {
      while ((await checkState()) && tout > 0) {
        tout -= step;
      }
    }
    return Promise.resolve(this.isConnected());
  },

  async connect() {
    if (this.state === 'connecting' || this.state === 'connected') return;

    this.publisher.connect();
    this.state = 'connecting';
  },

  newReader(topic, channel, props) {
    return new nsq.Reader(topic, channel, props);
  },

  async publish(topic, data, delay = false) {
    if (this.state === 'connected') {
      if (delay) {
        this.publisher.deferPublish(topic, data, Number(delay));
      } else {
        this.publisher.publish(topic, data);
      }
    } else {
      const now = Date.now();
      if (!this.expires) this.expires = now + (this.timeout || 0);

      if (now < this.expires) {
        setTimeout(() => {
          this.publish(topic, data, delay);
        }, this.republishTime);
      } else {
        this.expires = null;
      }
    }
  },
};
