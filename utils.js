const fs = require('fs');

exports.convertToMs = time => {
	matchedText = time.match(/^(\d+)([[smhd])$/);
	interval = ''
	measurement = ''

	if (matchedText !== null) {
		interval = matchedText[1];
		measurement = matchedText[2];
	} else {
		throw new Error('Invalid time was specified in settings.json. Should be like this: [number][smhd]');
	}
	
	switch(measurement) {
		case 's':
			interval = Number.parseInt(interval) * 1000;
			break; 
		case 'm':
			interval = Number.parseInt(interval) * 60 * 1000;
			break;
		case 'h':
			inteval = Number.parseInt(interval) * 60 * 60 * 1000;
			break;
		case 'd':
			inteval = Number.parseInt(interval) * 24 * 60 * 60 * 1000;
			break;
		default:
			interval = Number(3600000);
			break;
	}

	return interval;
}

exports.fileExists = filename => {
  try {
    require('fs').accessSync(filename)
    return true;
  } catch (error) {
    return false;
  }
}

exports.rearrangeObjectKeys = (oldObject, index) => {
	const newSubObj = {};
	const keys = Object.keys(oldObject);

	for (let i = 1, j = 0; i <= Object.keys(oldObject).length; i++, j++) {
		if (index < keys[j]) {
			newSubObj[keys[j] - 1] = oldObject[keys[j]];
		} else {
			newSubObj[i] = oldObject[i];
		}
	}

	return newSubObj;
}

exports.getResultObject = () => {
  let resultObj = {};

  if (!this.fileExists('result.json')) {
    throw new Error('There are no results yet. Nothing to synchronize');
  } else {
    resultObj = fs.readFileSync('result.json');
  }
  
  return JSON.parse(resultObj);
}

exports.logRequest = () => {
	if (!this.fileExists('log.txt')) {
    fs.closeSync(fs.openSync('log.txt', 'a'));
  }

  const stream = fs.createWriteStream("log.txt", {flags:'a'});
  stream.write(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "\n");
	stream.end();
}