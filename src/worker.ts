import { workerData, parentPort, threadId } from 'worker_threads';
import request from 'request';
import serialize from 'serialize-javascript';
import {
  CrawlerGlobalOnlyOptions,
  CrawlerOptions,
  CrawlerExtendedRequestOptions,
  CrawlerResponse,
} from './interfaces';

const buildRequest = () => {
  const {
    options,
  }: {
    options: CrawlerGlobalOnlyOptions &
      CrawlerExtendedRequestOptions &
      CrawlerOptions;
  } = workerData;

  console.log(`Thread ID: ${threadId}, ${options.method}: ${options.uri}`);

  request(
    options.uri,
    {
      method: options.method,
      gzip: options.gzip,
      headers: options.headers,
      timeout: options.timeout,
      // Rotate proxies if provided
      proxy:
        options.proxies &&
        options.proxies[Math.floor(Math.random() * options.proxies.length)],
    },
    (error: Error, response: CrawlerResponse) => {
      if (error) {
        return onRejection(error, options);
      }

      return onResponse(response);
    },
  );
};

const onRejection = (error: Error, options: CrawlerOptions) => {
  console.error(`Request error ${options.method} - ${options.uri}: ${error}`);

  if (options.retries) {
    console.log(
      `Retrying request ${options.method} - ${options.uri}, ${options.retries} retries left`,
    );
    return setTimeout(() => {
      options.retries -= 1;
      if (parentPort) {
        parentPort.postMessage({ error });
      }
      process.exit();
      // TODO:
      // Release worker
    }, options.retryTimeout);
  }

  return options.callback(error, null, () => process.exit());
};

const onResponse = (response: CrawlerResponse) =>
  parentPort.postMessage({ serializedRepsonse: serialize(response) });

buildRequest();
