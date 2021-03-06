import { Headers, Response } from 'request';
import { Options as JSDOMOptions, DOMWindow } from 'jsdom';

export interface CrawlerGlobalOnlyOptions {
  maxWorkers: number;
  proxies?: string[];
  priorityRange: number;
}

export interface CrawlerOptions {
  uri?: string;
  method: string;
  gzip: boolean;
  referer?: false | string;
  retries: number;
  priority: number;
  retryTimeout: number;
  timeout: number;
  // skipDuplicates?: boolean;
  // debug?: boolean;
  /* logger?: {
    log: (level: string, ...args: any[]) => void;
  }; */
  headers?: Headers;
  cheerio: {
    enable: boolean;
    options: CheerioOptionsInterface;
  };
  jsdom?: {
    enable?: boolean;
    options?: JSDOMOptions;
  };
  callback?: (
    err: Error | null,
    res: CrawlerResponse | null,
    done: () => void,
  ) => void;
  // [x: string]: any;
}

export interface CrawlerExtendedRequestOptions extends Partial<CrawlerOptions> {
  uri: string;
}

export interface CrawlerResponse extends Response {
  options?: CrawlerExtendedRequestOptions;
  $?: CheerioStatic;
  window?: DOMWindow;
}
