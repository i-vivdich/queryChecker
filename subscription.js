const fs = require('fs');
const utils = require('./utils');
const parser = require('./parser')

exports.addSubscription = sub => {
	let response = '';

	try {
	  const subs = JSON.parse(this.getSubscriptions())
		let newSubIndex = Object.keys(subs).length;
		newSubIndex++;

		normalizedSub = sub.map(x => {
			if (x === 'y') {
				return 'youtube';
			} else if (x === 'g') {
				return 'google';
			} else {
				return x;
			}
		})

		subs[newSubIndex] = normalizedSub; // add check for existed querry

	  fs.writeFileSync('subscriptions.json', JSON.stringify(subs), 'utf8');
		parser.insertNewQuery(subs, newSubIndex, true);

		const updatedResultObject = this.getResultObject();
		// const { title, url } = updatedResultObject[newSubIndex];
		response = `Your request <b>"${sub[1]}"</b> has been added to the subscriptions!`;
		// response = `Your request <b>"${sub[1]}"</b> has been added to the subscriptions!\nFirst look up on the request:\n<b><a href=\"${t}\">${t}</a></b>`;
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

		const resSubObj = this.getResultObject();
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

exports.getResultObject = () => {
  return utils.fileExists('result.json') ? JSON.parse(fs.readFileSync('result.json')) : {};
}