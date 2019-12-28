import { CrawlerOptions, CrawlerGlobalOnlyOptions, CrawlerExtendedRequestOptions } from './interfaces';
declare class Crawler {
    private defaultOptions;
    private options;
    constructor(options: Partial<CrawlerGlobalOnlyOptions> & CrawlerOptions);
    queue: (options: string | string[] | CrawlerExtendedRequestOptions) => void;
    private scheduleWorker;
    private injectCheerio;
    private injectJsdom;
}
export default Crawler;
