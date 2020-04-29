const fs = require('fs');
const utils = require('./utils');

exports.addSubscription = sub => {
	let response = '';

	try {
	  const subs = JSON.parse(getSubscriptions())
		let subsCount = Object.keys(subs).length;

		subs[++subsCount] = sub; // add check for existed querry

	  fs.writeFileSync('subscriptions.json', JSON.stringify(subs), 'utf8');
	  response = `Your request <b>"${sub[1]}"</b> has been added to the subscriptions!`;
	} catch (error) {
		response = `Something is wrong on the back-end. Error:\n <code>${error.message}</code>`;
	}

	return response;
}

exports.listSubscriptions = () => {
	let response = '';

	try {
		const subs = JSON.parse(getSubscriptions());
		const subsLength = Object.keys(subs).length;

		if (subsLength > 0) {
			for (let i = 1; i <= subsLength; i++) {
				response += `<code>${i}</code>:  [<i>${subs[i][0]}</i>]    <b>${subs[i][1]}</b>\n`;
			}
		} else {
			response = `You have no subscriptions at the moment. Add one with command: <code>youtube|google [search_string]</code>`;
		}
	} catch (error) {
		response = `Something is wrong on the back-end. Error:\n <code>${error.message}</code>`;
	}

	return response;
}

exports.removeSubscription = (index) => {
	let response = '';
	const newSubObj = {};

	try {
		const subs = JSON.parse(getSubscriptions());
		
		delete subs[index];

		const keys = Object.keys(subs); // make a stand-alone function in utils.js
		for (let i = 1, j = 0; i <= Object.keys(subs).length; i++, j++) {
			if (index < keys[j]) {
				newSubObj[keys[j] - 1] = subs[keys[j]];
			} else {
				newSubObj[i] = subs[i];
			}
		}

		fs.writeFileSync('subscriptions.json', JSON.stringify(newSubObj), 'utf8');
		response = `Subscription number <code>${index}</code> has been removed`;
		// remove subscription from RESULTS file
	} catch (error) {
		response = `Something is wrong on the back-end. Error:\n <code>${error.message}</code>`;
	}
	
	return response;
}

exports.getSubscriptions = () => {
	if (utils.fileExists('subscriptions.json')) {
		return fs.readFileSync('subscriptions.json');
	} else {
		fs.writeFileSync('subscriptions.json', JSON.stringify({}), 'utf8');
		return '{}';
	}
}