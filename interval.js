const fs = require('fs');
const utils = require('./utils');

exports.getInterval = () => {
	if (!utils.fileExists('settings.json')) {
		this.setInterval('1h');
	}
	
	return utils.convertToMs(JSON.parse(fs.readFileSync('settings.json')).checkInterval)
}

exports.setInterval = (time) => {
	fs.writeFileSync('settings.json', JSON.stringify({"checkInterval": time}), 'utf8');
}
