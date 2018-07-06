const token=require('../token');
const telegraf=require('telegraf');
const bot=new telegraf(token.TOKEN);
const session=require('telegraf/session');
const markup=require('telegraf/markup');
const request=require('request');
const fs=require('fs');

bot.telegram.getMe().then((botinfo)=>{console.log('Бот: '+botinfo.username);});
function getRegExp(cmd){cmd='(^| )('+cmd+')($| )';return new RegExp(cmd,'gi');}

bot.start((ctx)=>{console.log('Пользователь:',ctx.from.first_name+' '+ctx.from.last_name);
return ctx.reply('Привет, '+ctx.from.first_name+' '+ctx.from.last_name+'!👋').then(()=>ctx.reply('С чего начнем?'));});

bot.on('text',ctx=>{let cmd=ctx.message.text.toLowerCase();return ctx.reply(cmd);});


bot.use(session());
bot.startPolling();
