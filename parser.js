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
      	const searchQuery = (url === 'google') ? `https://www.google.com/search?q=${query}&tbs=qdr:d` : `https://www.youtube.com/results?search_query=${query}&sp=CAI%253D`;
        results.push(yield nightmare
          .goto(searchQuery)
          .wait(2000)
          .evaluate(url => {
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
              if (parsedElement) {
                result['title'] = document.getElementsByClassName("LC20lb DKV0Md")[0].innerText;
                result['url'] = parsedElement[0].href;
              } else {
                result['title'] = 'No match';
                result['url'] = 'No match';
              }
				  	}
            return result;
          }, url)
        );}
      yield nightmare.end();
      return results;
    })(urls, (err, res) => {
      if (err) reject (err);
      resolve(res);
    });
  });
}


exports.formResultFile = () => {
	const subs = JSON.parse(subscription.getSubscriptions());
	if (Object.keys(subs).length !== 0) {
  	this.parseSubs(subs, false)
   		.then(results => {
   			const resultOutput = {};

   			for (let i = 0; i < results.length; i++) {
   				resultOutput[i + 1] = results[i];
   			}

     		fs.writeFileSync('result.json', JSON.stringify(resultOutput, 'utf8'));
    	});
  }
}
