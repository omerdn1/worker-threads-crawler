import { Worker } from 'worker_threads';
import merge from 'lodash.merge';
import {
  CrawlerOptions,
  CrawlerGlobalOnlyOptions,
  CrawlerExtendedRequestOptions,
} from './interfaces';
import { AtLeast } from './types';

class Crawler {
  private defaultOptions = {
    maxWorkers: 10,
    method: 'GET',
    priority: 5,
    priorityRange: 10,
    retries: 3,
    retryTimeout: 10000,
    timeout: 15000,
  };

  private options: CrawlerGlobalOnlyOptions & CrawlerOptions;

  constructor(
    options: Partial<CrawlerGlobalOnlyOptions> &
      AtLeast<CrawlerOptions, 'callback'>,
  ) {
    if (!options.callback)
      throw new Error('Callback function was not provided!');

    this.options = { ...this.defaultOptions, ...options };
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

    const worker = new Worker('./worker', { workerData: mergedOptions });
    worker.once('message', (options: CrawlerOptions) => {
      console.log('message recieved from worker with options: ', options);
      this.scheduleWorker(options);
    });
    worker.on('exit', code => {
      console.log('worker stopped with exit code: ', code);
    });
  };
}

export default Crawler;
