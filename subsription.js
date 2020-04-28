const fs = require('fs');

exports.addSubscription = sub => {
	let subsCount = 0;
	let response;
	let subs = {};

	try {
		if (fs.accessSync('./subscriptions.json', fs.constants.F_OK)) {
	  	subs = JSON.parse(fs.readFileSync('subscriptions.json'));
			subsCount = Object.keys(subs).length; 
			subs[++subsCount] = sub; // add check for existed querry
	  } else {
	  	subs[++subsCount] = sub;
	  }

	  fs.writeFile('subscriptions.json', JSON.stringify({subs}), (error) => {
	  	if (error) throw error;
    	response = `Your request <b>"${sub[1]}"</b> has been added to the subscriptions!`
		});
	} catch (error) {
		response = `Something is wrong on the back-end. Error: ${error.message}`
	}

	return response;
}

exports.getSubcriptions = () => {
	return 'subscriptions';
}

exports.removeSubcription = (index) => {
	return 'removed';
}
