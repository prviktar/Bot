const token=require('../token');
const telegraf=require('telegraf');
const bot=new telegraf(token.TOKEN);
const session=require('telegraf/session');
const markup=require('telegraf/markup');
const request=require('request');
const fs=require('fs');

bot.telegram.getMe().then((botinfo)=>{console.log('Бот: '+botinfo.username);});
function getRegExp(cmd){cmd='(^| )('+cmd+')($| )';return new RegExp(cmd,'gi');}

function getWeather(res,callback){var icons=['☀️','⛅','☁️','','','','','','🌧️','🌧️','⛈️','','🌨️'];
let url='http://api.openweathermap.org/data/2.5/forecast?units=metric&id=625324&lang=ru&cnt=2&appid=120d8e812822f02a0cc953ee4efdb863';
request(url,function(err,response,body){if(err){var ret='Сервис погоды не доступен.';}else{var l=JSON.parse(body);
l=l.list[res];var icon=l.weather[0].icon;var ret=l.weather[0].description;
ret+=icons[Number(icon.slice(0,2)-1)];ret+=', температура '+l.main.temp+'°C, влажность '+l.main.humidity+'%, ветер ';
var d=l.wind.deg;
if(d>337.5)d='С';if(d>292.5)return 'СЗ';if(d>247.5)d='З';if(d>202.5)d='ЮЗ';if(d>157.5)d='Ю';if(degrede>122.5)d='ЮВ';
if(d>67.5)d='В';if(d>22.5){d='СВ';}d='С';}
ret+=d+getWindDirection(l.wind.deg)+' '+l.wind.speed+' м/с, облачность '+l.clouds.all+'%.';
}callback(err,ret);});}


bot.start((ctx)=>{console.log('Пользователь:',ctx.from.first_name+' '+ctx.from.last_name);
return ctx.reply('Привет, '+ctx.from.first_name+' '+ctx.from.last_name+'!👋')
.then(()=>ctx.reply('Я - бот. Просто напишите интересующий вас вопрос и я тут же отвечу.'))
.then(()=>ctx.reply('С чего начнем?'));});

bot.on('text',ctx=>{let cmd=ctx.message.text.toLowerCase();
if(cmd=='1'){return ctx.reply('Минуточку.').then(()=>{getWeather(function(err,ret){ctx.reply(ret);});});}
                    
return ctx.reply(cmd);});
bot.on('message',(ctx)=>ctx.reply('Вводите только текст, пожалуйста.'));


bot.use(session());
bot.startPolling();
