const fs = require('fs');
const utils = require('./utils');

function getInterval() {
	data = fs.readFileSync('settings.json');
	return utils.convertToMs(JSON.parse(data).checkInterval)
}

function setInterval(time) {
	fs.writeFileSync('settings.json', JSON.stringify({"checkInterval": time}), 'utf8');
}
