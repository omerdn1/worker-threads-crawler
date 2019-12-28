import { Worker } from 'worker_threads';
import cheerio from 'cheerio';
import { JSDOM, Options as JSDOMOptions } from 'jsdom';
import merge from 'lodash.merge';
import deserialize from './deserialize';
import {
  CrawlerOptions,
  CrawlerGlobalOnlyOptions,
  CrawlerExtendedRequestOptions,
  CrawlerResponse,
} from './interfaces';

class Crawler {
  private defaultOptions: CrawlerGlobalOnlyOptions & CrawlerOptions = {
    maxWorkers: 10,
    method: 'GET',
    gzip: true,
    priority: 5,
    priorityRange: 10,
    retries: 3,
    retryTimeout: 10000,
    timeout: 15000,
    cheerio: {
      enable: true,
      options: {
        normalizeWhitespace: false,
        xmlMode: false,
        decodeEntities: true,
      },
    },
  };

  private options: CrawlerGlobalOnlyOptions & CrawlerOptions;

  constructor(options: Partial<CrawlerGlobalOnlyOptions> & CrawlerOptions) {
    if (!options.callback)
      throw new Error('Callback function was not provided!');

    this.options = merge({}, this.defaultOptions, options);
  }

  queue = (options: string | string[] | CrawlerExtendedRequestOptions) => {
    const queueItems = Array.isArray(options) ? options : [options];
    queueItems.forEach(queueItem => {
      this.scheduleWorker(
        String(queueItem) === queueItem
          ? { uri: queueItem }
          : (queueItem as CrawlerExtendedRequestOptions),
      );
    });
  };

  private scheduleWorker = (
    options: CrawlerExtendedRequestOptions | CrawlerOptions,
  ) => {
    const { callback, ...workerOptions } = merge({}, this.options, options);
    // TODO:
    // Apply priority
    // ...

    const worker = new Worker(
      './node_modules/worker-threads-crawler/dist/worker.js',
      {
        workerData: { options: workerOptions },
      },
    );
    worker.once(
      'message',
      ({
        error,
        serializedRepsonse,
      }: {
        error: Error;
        serializedRepsonse: string;
      }) => {
        if (error) {
          console.log(
            'message recieved from worker with options: ',
            workerOptions,
          );
          return this.scheduleWorker(workerOptions);
        }

        const response = deserialize(serializedRepsonse);
        const { cheerio, jsdom } = workerOptions;

        if (cheerio?.enable) {
          const $ = this.injectCheerio(response, cheerio.options);
          response.$ = $;
        }

        if (jsdom?.enable) {
          const window = this.injectJsdom(response, jsdom.options);
          response.window = window;
        }
        return callback(null, response, () => worker.terminate());
      },
    );
  };

  private injectCheerio = (
    response: CrawlerResponse,
    cheerioOptions?: CheerioOptionsInterface,
  ) => {
    const $ = cheerio.load(response.body, cheerioOptions);

    return $;
  };

  private injectJsdom = (
    response: CrawlerResponse,
    jsdomOptions?: JSDOMOptions,
  ) => {
    const { window } = new JSDOM(response.body, jsdomOptions);

    return window;
  };
}

export default Crawler;
