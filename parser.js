const fs = require('fs');
const vo = require('vo');
const Nightmare = require('nightmare');

const subscription = require('./subscription');

// pass true to 'visible' for visual representation of browser automation by nightmare
exports.parseSubs = (urls, visible = false) => {
  return new Promise((resolve, reject) => {
    vo(function * (urls) {
      const nightmare = new Nightmare({
        show: visible
      });
      const results = [];
      for (let i = 1; i <= Object.keys(urls).length; i++) {
      	const [url, query] = urls[i];
        const searchQuery = getQuery(url, query);

        results.push(yield nightmare
          .goto(searchQuery)
          .wait(2000)
          .evaluate(evaluate, url)
        );}
      yield nightmare.end();
      return results;
    })(urls, (err, res) => {
      if (err) reject (err);
      resolve(res);
    });
  });
}

exports.insertNewQuery = (subs, index, visible = false) => {
  const nightmare = new Nightmare({show: visible});
  const [url, query] = subs[index];
  const searchQuery = getQuery(url, query);
  
  nightmare
    .goto(searchQuery)
    .wait(2000)
    .evaluate(evaluate, url)
    .end()
    .then(result => {
      const oldRes = subscription.getResultObject();

      oldRes[index] = result;
      fs.writeFileSync('result.json', JSON.stringify(oldRes), 'utf8');
      return 'test';
    })
    .catch(error => {
      throw error;
    })
}

function getQuery(url, query) {
  return url === 'google' ? `https://www.google.com/search?q=${query}&tbs=qdr:d` : `https://www.youtube.com/results?search_query=${query}&sp=CAI%253D`;
}

function evaluate(url) {
  const result = {};

  if (url === 'youtube') {
    let parsedElement = document.getElementById('video-title');
    if (parsedElement) {
      result['title'] = parsedElement.innerText;
      result['url'] = parsedElement.href;
    } else {
      result['title'] = 'No match';
      result['url'] = 'No match';
    }
  } else {
    let parsedUrl = document.querySelectorAll('div.r > a');
    if (parsedUrl) {
      result['title'] = document.getElementsByClassName("LC20lb DKV0Md")[0].innerText;
      result['url'] = parsedUrl[0].href;
    } else {
      result['title'] = 'No match';
      result['url'] = 'No match';
    }
  }

  return result;
}
