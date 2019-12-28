import { Worker, WorkerOptions } from 'worker_threads';

// Workaround for: https://github.com/TypeStrong/ts-node/issues/676
export default (file: string, wkOpts: WorkerOptions) => {
  // wkOpts.eval = true;
  if (!wkOpts.workerData) {
    wkOpts.workerData = {};
  }
  // eslint-disable-next-line no-underscore-dangle
  wkOpts.workerData.__filename = file;
  return new Worker(
    './node_modules/worker-threads-crawler/dist/worker.js',
    wkOpts,
  );
};
