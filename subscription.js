const fs = require('fs');
const utils = require('./utils');

exports.addSubscription = sub => {
	let response = '';

	try {
	  const subs = JSON.parse(this.getSubscriptions())
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
		const subs = JSON.parse(this.getSubscriptions());
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

	try {
		const subs = JSON.parse(this.getSubscriptions());
		const subsLength = Object.keys(subs).length

		if (index > subsLength || index == 0) {
			throw new Error(`${index}-th element is not present in the subscriptions list. There are only 1 - ${subsLength} elements`);
		} else {
			delete subs[index];
		}

		const newSubObj = utils.rearrangeObjectKeys(subs, index);
		fs.writeFileSync('subscriptions.json', JSON.stringify(newSubObj), 'utf8');

		const resSubObj = utils.getResultObject();
		delete resSubObj[index];

		const newResultSubObj = utils.rearrangeObjectKeys(resSubObj, index);
		fs.writeFileSync('result.json', JSON.stringify(newResultSubObj), 'utf8');

		response = `Subscription number <code>${index}</code> has been removed`;
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