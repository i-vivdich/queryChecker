const fs = require('fs');
const utils = require('./utils');

exports.addSubscription = sub => {
	let response = '';

	try {
	  const subs = JSON.parse(getSubscriptions())
		let subsCount = Object.keys(subs).length; 
		subs[++subsCount] = sub; // add check for existed querry

	  fs.writeFileSync('subscriptions.json', JSON.stringify(subs));
	  response = `Your request <b>"${sub[1]}"</b> has been added to the subscriptions!`;
	} catch (error) {
		response = `Something is wrong on the back-end. Error:\n <code>${error.message}</code>`;
	}

	return response;
}

exports.listSubcriptions = () => {
	let response = '';

	try {
		const subs = getSubscriptions();
		if (Object.keys(subs).length > 0) {
			for (const sub of subs) {
				response += `<code>${subs[sub]}</code>: <i>${subs[sub][0]}</i><b>${subs[sub][1]}</b>\n`;
			}
		} else {
			response = `You have no subscriptions at the moment. Add one with command: <code>youtube|google [search_string]</code>`;
		}
	} catch (error) {
		response = `Something is wrong on the back-end. Error:\n <code>${error.message}</code>`;
	}

	return response;
}

exports.removeSubcription = (index) => {
	return 'removed';
}

function getSubscriptions() {
	if (utils.fileExists('subscriptions.json')) {
		return JSON.parse(fs.readFileSync('subscriptions.json'));
	} else {
		fs.writeFileSync('subscriptions.json', JSON.stringify({}));
		return {};
	}
}