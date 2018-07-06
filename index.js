const Token=require('../token');
const Telegraf=require('telegraf');
const bot=new Telegraf(Token.TOKEN);

bot.telegram.getMe().then((botinfo)=>{console.log('Бот: '+botinfo.username);});
bot.start((ctx)=>{console.log('Пользователь:',ctx.from.first_name+' '+ctx.from.last_name);
return ctx.reply('Привет, '+ctx.from.first_name+' '+ctx.from.last_name+'!👋');
});


bot.startPolling();
