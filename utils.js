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