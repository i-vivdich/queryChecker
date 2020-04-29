const utils = require('./utils');
const Nightmare = require('nightmare');
// const nightmare = Nightmare({ show: true }); // uncomment in case graphical representation is needed
const nightmare = Nightmare();

function parseSub = sub => {
	let [url, query] = sub;
	searchQuery = url === 'google' ? `https://www.google.com/search?q=${query}&tbs=qdr:d` : `https://www.youtube.com/results?search_query=${query}&sp=CAI%253D`;

	nightmare
	  .goto(searchQuery)
	  .evaluate(() => {
	  	let result;
	  	if (url === 'youtube') {
	  		result = document.querySelector('a[id="video-title"]');
	  	} else {
	  		result = document.querySelector('r > a');
	  	}
			return result;
	  })
	  .end()
	  .then(result => {
	  	return result;
	  })
	  .catch(error => {
	    return `Something went wrong on the back-end while parsing query results. Error:\n <code>${error.message}</code>`;
	  });
}

exports.parseSubscriptions = () => {
	const subs = JSON.parse(utils.getSubscriptions());

	const test = parseSub(['google', 'stocksubmitter']);
	return test;
}