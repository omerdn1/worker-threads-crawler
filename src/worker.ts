import { workerData, parentPort, threadId } from 'worker_threads';
import request from 'request';
import cheerio from 'cheerio';
import { JSDOM, Options as JSDOMOptions } from 'jsdom';
import serialize from 'serialize-javascript';
import deserialize from './deserialize';
import {
  CrawlerGlobalOnlyOptions,
  CrawlerOptions,
  CrawlerExtendedRequestOptions,
  CrawlerResponse,
  CheerioOptions,
} from './interfaces';

const buildRequest = () => {
  const options: CrawlerGlobalOnlyOptions &
    CrawlerExtendedRequestOptions &
    CrawlerOptions = deserialize(workerData.options);

  console.log(`Thread ID: ${threadId}, ${options.method}: ${options.uri}`);

  request(
    options.uri,
    {
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

      return onResponse(response, options);
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
        parentPort.postMessage(serialize(options));
      }
      process.exit();
      // TODO:
      // Release worker
    }, options.retryTimeout);
  }

  return options.callback(error, null, () => process.exit());
};

const onResponse = (response: CrawlerResponse, options: CrawlerOptions) => {
  const { cheerio, jsdom } = options;

  if (cheerio?.enable) {
    const $ = injectCheerio(response, cheerio.options);
    response.$ = $;
  }

  if (jsdom?.enable) {
    const window = injectJsdom(response, jsdom.options);
    response.window = window;
  }

  return options.callback(null, response, () => process.exit());
};

const injectCheerio = (
  response: CrawlerResponse,
  cheerioOptions?: CheerioOptions,
) => {
  const $ = cheerio.load(response.body, cheerioOptions);

  return $;
};

const injectJsdom = (
  response: CrawlerResponse,
  jsdomOptions?: JSDOMOptions,
) => {
  const { window } = new JSDOM(response.body, jsdomOptions);

  return window;
};

buildRequest();
