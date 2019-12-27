/// <reference types="cheerio" />

import { Headers, Response } from 'request';
import { Options as JSDOMOptions, DOMWindow } from 'jsdom';

export interface CheerioOptions {
  xmlMode?: boolean;
  decodeEntities?: boolean;
  lowerCaseTags?: boolean;
  lowerCaseAttributeNames?: boolean;
  recognizeCDATA?: boolean;
  recognizeSelfClosing?: boolean;
  normalizeWhitespace?: boolean;
  ignoreWhitespace?: boolean;
}
export interface CrawlerGlobalOnlyOptions {
  maxWorkers: number;
  proxies?: string[];
  priorityRange: number;
}
export interface CrawlerOptions {
  uri?: string;
  method: string;
  referer?: false | string;
  retries: number;
  priority: number;
  retryTimeout: number;
  timeout: number;
  headers?: Headers;
  cheerio?: {
    enable?: boolean;
    options?: CheerioOptions;
  };
  jsdom?: {
    enable?: boolean;
    options?: JSDOMOptions;
  };
  callback: (
    err: Error | null,
    res: CrawlerResponse | null,
    done: () => void,
  ) => void;
}
export interface CrawlerExtendedRequestOptions extends Partial<CrawlerOptions> {
  uri: string;
}
export interface CrawlerResponse extends Response {
  options?: CrawlerExtendedRequestOptions;
  $?: CheerioStatic;
  window?: DOMWindow;
}
