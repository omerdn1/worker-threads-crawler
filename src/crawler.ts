import { Worker } from 'worker_threads';
import merge from 'lodash.merge';
import serialize from 'serialize-javascript';
import {
  CrawlerOptions,
  CrawlerGlobalOnlyOptions,
  CrawlerExtendedRequestOptions,
} from './interfaces';
import deserialize from './deserialize';

class Crawler {
  private defaultOptions: CrawlerGlobalOnlyOptions & CrawlerOptions = {
    maxWorkers: 10,
    method: 'GET',
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
    const mergedOptions = merge({}, this.options, options);
    // TODO:
    // Apply priority
    // ...

    const worker = new Worker(
      './node_modules/worker-threads-crawler/dist/worker.js',
      {
        workerData: { options: serialize(mergedOptions) },
      },
    );
    worker.once('message', serializedOptions => {
      const options: CrawlerOptions = deserialize(serializedOptions);
      console.log('message recieved from worker with options: ', options);
      this.scheduleWorker(options);
    });
  };
}

export default Crawler;
