const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');
const fs = require('fs');

const interval = require('./interval');
const subscription = require('./subscription');
const parser = require('./parser');
const utils = require('./utils');

const token = '1289063456:AAFecnCxAcB2UkkfVoQEB3gtCndKfx2zFVg';
const bot = new TelegramBot(token, {polling: true});
const rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59, 2); // new schedule.Range(0, 59, 15); - to check every 15 minutes
// rule.hours = new schedule.Range(0, 23, 1);
let checker = true;

bot.onText(/^\/(start|help)$/, (msg) => {
	bot.sendMessage(msg.chat.id, "List of commands:\n-> <code>youtube|google [search_string]</code> - to add subscription to the list\n-> <code>?</code> - to get the list of subscriptions\n-> <code>-[number]</code> - to delete subscription number=[number]", {parse_mode: "HTML"});  
});

bot.onText(/^(set)[\s](\d+[smhd])$/, (msg, match) => {
	if (match !== null) {
		let response = '';

		try {
			if (Number.parseInt(match[2]) <= 0) {
				throw new Error('interval cannot be equal or less than 0')
			}
			interval.setInterval(match[2]);
			response = `Settings have been succesfully updated! New interval is <b>${match[2]}</b>`
		} catch (error) {
			response = `Something went wrong while updating settings.\nError: <code>${error.message}</code>`
		} finally {
			bot.sendMessage(msg.chat.id, response, {parse_mode: "HTML"});  
		}
	}
});

// listen for any kind of message - but we are aiming only for text messages
bot.on('message', initiateBotLifeCycle)

function initiateBotLifeCycle(msg) {
	const chatId = msg.chat.id;

	const matchedText = msg.text.match(/^(y|youtube|google|g)[\s](.+)$|^([\?])$|^[-](\d+)$/);
	let response = '';

	// a bit tricky style of writing (lulz), could be rewritten in case long-term support is needed
	if (matchedText !== null) {
		response = (matchedText[1] === 'youtube' || matchedText[1] === 'google' || matchedText[1] === 'y' || matchedText[1] === 'g') 
									? subscription.addSubscription([matchedText[1], matchedText[2]])
									: matchedText[3] === '?'
											? subscription.listSubscriptions()
											: matchedText[4] ? subscription.removeSubscription(matchedText[4]) : false;
	} else {
		response = 'Incorrect input format! Should be:\n<code>youtube|google [search_string]</code> - for adding subscription\n<code>?</code> - for listing subscriptions\n<code>-[number]</code> - for deleting nth subscription';

		if (msg.text === '/start' || msg.text === '/help' || msg.text.match(/^(set)[\s](\d+[smhd])$/)) {
			return;
		} else if (msg.text.includes('/start') || msg.text.includes('/help')) {
			response = "You probably looked for <code>/start</code> or <code>/help</code>"
		}
	}

	bot.sendMessage(chatId, response, {parse_mode: "HTML"});

	if (checker) {
		const job = schedule.scheduleJob(rule, () => {
			const oldResult = subscription.getResultObject();
			const oldLength = Object.keys(oldResult).length;
			const subs = JSON.parse(subscription.getSubscriptions());

			parser.parseSubs(subs, true)
	 			.then(results => {
	 				const resultOutput = {};

		 			for (let i = 0; i < results.length; i++) {
		 				const { title: newTitle, url: newUrl } = results[i];
		 				if (i >= oldLength) {
		 					resultOutput[i + 1] = results[i];
		 				} else {
		 					const { title: oldTitle, url: oldUrl } = oldResult[i + 1];

		 					if ((newTitle != oldTitle) || (newUrl != oldUrl)) {
		 						bot.sendMessage(chatId, `Update on your sub "<b><code>${subs[i + 1][1]}</code></b>" is found:\n<b><a href=\"${newUrl}\">${newTitle}</a></b>`, {parse_mode: "HTML"});
		 					} 
		 					resultOutput[i + 1] = results[i];
		 				}
		 			}

	   			fs.writeFileSync('result.json', JSON.stringify(resultOutput, 'utf8'));
	  		});

			utils.logRequest();
		});
		checker = false;
	}
}
