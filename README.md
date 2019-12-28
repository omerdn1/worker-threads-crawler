# worker-threads-crawler

NodeJS worker threads (`worker_threads`) web crawler/spider. Inspired by [node-crawler](https://github.com/bda-research/node-crawler).

_Note: worker threads became available in Node.js v. 11.7.0_

## Get started

### Installation

`npm install --save worker-threads-crawler`

### Basic usage

```js
const c = new Crawler({
  callback: function(err, res, done) {
    if (err) {
      console.log('ERROR: ', err);
    } else {
      // Cheerio is enabled by default
      const { $ } = res;
      console.log($('title').text());
    }
    done();
  },
});

// Queue just one URL
c.queue('http://www.amazon.com');

// Queue a list of URLs
c.queue(['https://www.google.com', 'https://www.instagram.com']);

// Queue URLs with custom callbacks & parameters
c.queue([
  {
    uri: 'http://www.yahoo.com',
    // Enabling JSDOM
    jsdom: {
      enable: true,
    },

    // The global callback won't be called
    callback: function(error, res, done) {
      if (error) {
        console.log(error);
      } else {
        const { window } = res;
        console.log(window.document.title);
      }
      done();
    },
  },
]);
```
