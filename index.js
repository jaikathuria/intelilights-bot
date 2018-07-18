const TOKEN = '573081808:AAEKiirOgAkawx_6Q2qINcZfE0bEeZGl3Jk';
//const TOKEN = process.env.TELEGRAM_TOKEN || '';
const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const options = {
  polling: true,
  
};

const bot = new TelegramBot(TOKEN, options);
let imageurl = null;

bot.onText(/.*/, msg => {
    bot.sendMessage(msg.chat.id, 'Please send a picture of the accident.');
});

bot.on('message', (msg) => {
    if(msg.photo){

        const fileId = msg.photo[1].file_id;
        const url = `https://api.telegram.org/bot${TOKEN}/getFile?file_id=${fileId}`
        request(url,(err,res,body) => {
          imageurl = `https://api.telegram.org/file/bot${TOKEN}/${JSON.parse(body).result.file_path}`
        })

        imageId = msg.photo[1].file_id;
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
    if(msg.location && imageurl){
      const { location, message_id } = msg
      
      bot.sendMessage(msg.chat.id, 'Thank you for reporting.');
      request.post({
        headers: {'content-type': 'application/json'},
        url: 'http://18.191.226.151/accident-report',
        body: JSON.stringyfy({
          imageurl,
          location,
          message_id
        },(err,res,body)=>{
	   console.log(JSON.parse(body))
	})
      })  
      console.log(imageurl)
    }
});


// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };
  let text;

  if (action === 'edit') {
    text = 'Edited Text';
  }

  bot.editMessageText(text, opts);
});



