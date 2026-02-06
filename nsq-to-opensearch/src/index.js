const nsq = require('nsqjs');

const reset = '\x1b[0m';
const red = '\x1b[31m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const blue = '\x1b[34m';
const magenta = '\x1b[35m';
const cyan = '\x1b[36m';
// const white = '\x1b[37m';

const nsqlookupd = 'nsqlookupd:4161';
const canal = 'get_log-json';
const queue = 'log-json';

const reader = new nsq.Reader(queue, canal, {
  lookupdHTTPAddresses: nsqlookupd,
  maxInFlight: 10,
  maxRetries: 100,
});
setTimeout(() => {
  console.log(`${green}${new Date().toISOString()}: ${yellow}Connecting to NSQ... ${nsqlookupd}, queue '${queue}', channel '${canal}'${reset}`);
  reader.connect();
}, 3000);

const dtForm = () => {
  const date = new Date();
  return date.toISOString().slice(0, 10);
};

const SendToOpenSearch = async (id, payload) => {
  const topic = payload?.topic || 'unknown-topic';

  delete payload.topic;

  const url = `http://opensearch:9200/log_${topic}_${dtForm()}/_doc`;

  try {
    if (!url) {
      throw new Error('Invalid opensearch host');
    }
    const dataString = JSON.stringify(payload);
    // const authorization = `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`; /* NOSONAR */

    console.log(`${green}${new Date().toISOString()}: ${cyan}Sending [${id}] to OpenSearch\n${cyan}at ${url}:${reset}`, payload);
    const options = {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': dataString.length,
        // authorization,
      },
      body: dataString,
      signal: AbortSignal.timeout(15000),
    };

    const response = await fetch(url, options);
    if (!response?.status) return null;
    const code = response.status;
    const result = await response.json();
    return { code, result };
  } catch (err) {
    console.error(`${green}${new Date().toISOString()}: ERROR sending to OpenSearch:${reset}`, { msg: err.message });
  }
  return null;
};

reader.on(nsq.Reader.MESSAGE, async (msg) => {
  const logData = msg?.json && msg.json();
  const id = msg.id;
  // console.log(`logData`, logData);
  const resp = await SendToOpenSearch(id, logData);
  const codeCollor = resp?.code >= 100 && resp?.code < 300 ? green : red;
  const result = resp?.result || {};
  console.log(`${green}${new Date().toISOString()}: ${blue}Response [${id}] from OpenSearch:\n${codeCollor}Code: ${resp?.code}\n${codeCollor}Result: ${reset}`, result);
  msg.finish();
});
reader.on(nsq.Reader.DISCARD, (msg) => {
  const txt = msg.body.toString();
  console.log(`${green}${new Date().toISOString()}: ${red}Discarded: ${txt}${reset}`);
  msg.finish();
});
reader.on(nsq.Reader.ERROR, (err) => {
  console.log(`${green}${new Date().toISOString()}: ${red}NSQ error: ${err}${reset}`);
});
reader.on(nsq.Reader.READY, () => {
  console.log(`${green}${new Date().toISOString()}: NSQ reader is ready${reset}`);
});
reader.on(nsq.Reader.NSQD_CONNECTED, () => {
  console.log(`${green}${new Date().toISOString()}: NSQ reader is connected${reset}`);
});
reader.on(nsq.Reader.NSQD_CLOSED, () => {
  console.log(`${green}${new Date().toISOString()}: ${red}NSQ reader is closed${reset}`);
});

// cleanup old data

const getAllIndexes = async () => {
  const urlAll = `http://opensearch:9200/_cat/indices?format=json`;
  try {
    if (!urlAll) {
      throw new Error('Invalid opensearch host');
    }

    const options = {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    };

    const response = await fetch(urlAll, options);
    if (!response?.status) return null;
    const code = response.status;
    const result = await response.json();
    return { code, result };
  } catch (err) {
    console.error(`${green}${new Date().toISOString()}: ${red}ERROR fetching indexes from OpenSearch:${reset}`, { msg: err.message });
  }
  return null;
};

const tmClean = (tpo) => {
  console.log(`${green}${new Date().toISOString()}: ${magenta}Next Clean check in (seconds):${reset}`, tpo);
  
  const doClean = async () => {
    console.log(`${green}${new Date().toISOString()}: ${magenta}Starting clean operation${reset}`);
    const allIdxs = await getAllIndexes();
    // console.log(`allIdxs`, allIdxs);

    if (Array.isArray(allIdxs?.result) === false || allIdxs.result.length === 0) {
      console.log(`${green}${new Date().toISOString()}: ${yellow}No indexes found to analyze.${reset}`);
      tmClean(5 * 60);
      return;
    }

    allIdxs.result.forEach(async (idx) => {
      if (idx?.index.includes('log_')) {
        console.log(`${green}${new Date().toISOString()}: ${red}Analyzing index timeout${reset}`, idx);
        // Use regex to extract date part (YYYY-MM-DD) from index name
        const match = idx.index.match(/\d{4}-\d{2}-\d{2}$/);
        if (!match) return;
        const datePart = match[0];
        const indexDate = new Date(`${datePart}T00:00:00Z`);
        const now = new Date();
        const diffTime = Math.abs(now - indexDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 7) {
          // delete index
          const urlDel = `http://opensearch:9200/${idx.index}`;
          const optionsDel = {
            method: 'DELETE',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(15000),
          };
          try {
            const responseDel = await fetch(urlDel, optionsDel);
            const codeDel = responseDel.status;
            const resultDel = await responseDel.json();
            console.log(`${green}${new Date().toISOString()}: ${red}Deleted index ${magenta}${idx.index} (age: ${diffDays} days)${reset}`, { codeDel, resultDel });
          } catch (err) {
            console.error(`${green}${new Date().toISOString()}: ${red}ERROR deleting index from OpenSearch:${reset}`, { msg: err.message });
          }
        }
      } else if (idx?.index.includes('top_')) {
        console.log(`${green}${new Date().toISOString()}: ${red}Analyzing index timeout${reset}`, idx);
        // Use regex to extract date part (YYYY.MM.DD) from index name
        const match = idx.index.match(/\d{4}\.\d{2}\.\d{2}/);
        if (!match) return;
        const datePart = match[0];
        const indexDate = new Date(`${datePart.replace(/\./g, '-')}T00:00:00Z`);
        const now = new Date();
        const diffTime = Math.abs(now - indexDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 1) {
          // delete index
          const urlDel = `http://opensearch:9200/${idx.index}`;
          const optionsDel = {
            method: 'DELETE',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(15000),
          };
          try {
            const responseDel = await fetch(urlDel, optionsDel);
            const codeDel = responseDel.status;
            const resultDel = await responseDel.json();
            console.log(`${green}${new Date().toISOString()}: ${red}Deleted index ${magenta}${idx.index} (age: ${diffDays} days)${reset}`, { codeDel, resultDel });
          } catch (err) {
            console.error(`${green}${new Date().toISOString()}: ${red}ERROR deleting index from OpenSearch:${reset}`, { msg: err.message });
          }
        }
      }
    });
    console.log(`${green}${new Date().toISOString()}: ${magenta}Clean finished${reset}`);
    tmClean(60 * 60);
  }
  setTimeout(doClean, tpo * 1000);
};

tmClean(1);

// curl -X GET http://127.0.0.1:9200/_cat/indices?format=json
// curl -X DELETE http://127.0.0.1:9200/repa-svc-2026-01-12
