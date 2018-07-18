const TOKEN = '573081808:AAEKiirOgAkawx_6Q2qINcZfE0bEeZGl3Jk';
//const TOKEN = process.env.TELEGRAM_TOKEN || '';
const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const options = {
  polling: true,
  
};

const bot = new TelegramBot(TOKEN, options);
let imageID = null;

bot.onText(/.*/, msg => {
    bot.sendMessage(msg.chat.id, 'Please send a picture of the accident.');
});

bot.on('message', (msg) => {
    if(msg.photo){
        imageID = msg.photo[1].file_id;
        const opts = {
            "parse_mode": "Markdown",
            "reply_markup": {
                "one_time_keyboard": true,
                "resize_keyboard": true,
                "keyboard": [[{
                    text: "SEND LOCATION",
                    request_location: true
                }]]
            }
        };
        bot.sendMessage(msg.chat.id, 'Please let us know about your location too.', opts);
    }
});


bot.on('message', (msg) => {
    if(msg.location && imageID){
      const { location, message_id } = msg
      bot.sendMessage(msg.chat.id, 'Thank you for reporting.');
      const url = `http://18.191.226.151/accident-report?msg=${message_id}&lat=${location.latitude}&lon=${location.longitude}&url=${imageID}`
      console.log(url)
      request(url,(err,res,body)=>{
	       console.log({location,message_id,imageID})
	    })
    }
});


