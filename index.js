const TelegramBot = require('node-telegram-bot-api');

const token = '1289063456:AAFecnCxAcB2UkkfVoQEB3gtCndKfx2zFVg'
const bot = new TelegramBot(token, { polling: true });

bot.onText(/^\/(start|help)$/, (msg) => {
	bot.sendMessage(msg.chat.id, "List of commands:\n-> <code>youtube|google [search_string]</code> - to add subscription to the list\n-> <code>?</code> - to get the list of subscriptions\n-> <code>-[number]</code> - to delete subscription number=[number]", {parse_mode: "HTML"});  
});

// Listen for any kind of message - but we are aiming only for text messages
bot.on('message', respondToUser)

function respondToUser(msg) {
	const chatId = msg.chat.id;
	const matchedText = msg.text.match(/^(youtube|google)[\s](.+)$|^([\?])$|^[-](\d+)$/);
	let response = '';

	if (matchedText !== null) {
		response = (matchedText[1] === 'youtube' || matchedText[1] === 'google') 
									? `Your request <b>"${matchedText[2]}"</b> has been added to the subscriptions!`
									: matchedText[3] === '?' 
											? "list of subscriptions" 
											: matchedText[4] ? "delete subscription" : false;
	} else {
		response = 'Incorrect input format! Should be:\n<code>youtube|google [search_string]</code> - for adding subscription\n<code>?</code> - for listing subscriptions\n<code>-[number]</code> - for deleting nth subscription';

		if (msg.text === '/start' || msg.text === '/help') {
			return;
		} else if (msg.text.includes('/start') || msg.text.includes('/help')) {
			response = "You probably looked for <code>/start</code> or <code>/help</code> command"
		}
	}

	bot.sendMessage(chatId, response, {parse_mode: "HTML"});
}