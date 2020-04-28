const TelegramBot = require('node-telegram-bot-api');
const interval = require('./interval');
const subscription = require('./subscription');

const token = '1289063456:AAFecnCxAcB2UkkfVoQEB3gtCndKfx2zFVg'
const bot = new TelegramBot(token, { polling: true });

bot.onText(/^\/(start|help)$/, (msg) => {
	bot.sendMessage(msg.chat.id, "List of commands:\n-> <code>youtube|google [search_string]</code> - to add subscription to the list\n-> <code>?</code> - to get the list of subscriptions\n-> <code>-[number]</code> - to delete subscription number=[number]\n-> <code>set [number][smhd]</code> - to set interval for parsing", {parse_mode: "HTML"});  
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
bot.on('message', respondToUser)

function respondToUser(msg) {
	const chatId = msg.chat.id;
	const matchedText = msg.text.match(/^(youtube|google)[\s](.+)$|^([\?])$|^[-](\d+)$/);
	let response = '';

	// a bit tricky style of writing, could be rewritten in case long-term support is needed
	if (matchedText !== null) {
		response = (matchedText[1] === 'youtube' || matchedText[1] === 'google') 
									? subscription.addSubscription([matchedText[1], matchedText[2]])
									: matchedText[3] === '?'
											? subscription.getSubcriptions()
											: matchedText[4] ? subscription.removeSubcription(matchedText[4]) : false;
	} else {
		response = 'Incorrect input format! Should be:\n<code>youtube|google [search_string]</code> - for adding subscription\n<code>?</code> - for listing subscriptions\n<code>-[number]</code> - for deleting nth subscription\n<code>set [number][smhd]</code> - to set interval for parsing';

		if (msg.text === '/start' || msg.text === '/help' || msg.text.match(/^(set)[\s](\d+[smhd])$/)) {
			return;
		} else if (msg.text.includes('/start') || msg.text.includes('/help') || msg.text.includes('set')) {
			response = "You probably looked for <code>/start</code>, <code>/help</code> or <code>set [number][smhd]</code> command"
		}
	}

	bot.sendMessage(chatId, response, {parse_mode: "HTML"});
}