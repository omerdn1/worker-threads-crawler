import { CrawlerOptions, CrawlerGlobalOnlyOptions, CrawlerExtendedRequestOptions } from './interfaces';
import { AtLeast } from './types';
declare class Crawler {
    private defaultOptions;
    private options;
    constructor(options: Partial<CrawlerGlobalOnlyOptions> & AtLeast<CrawlerOptions, 'callback'>);
    queue: (options: string | string[] | CrawlerExtendedRequestOptions) => void;
    private scheduleWorker;
}
export default Crawler;
