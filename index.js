const token=require('../token');
const telegraf=require('telegraf');
const session=require('telegraf/session');
const markup=require('telegraf/markup');
const request=require('request');
const fs=require('fs');
const bot=new telegraf(token.TOKEN);
//
const welcome_hi=['Привет','Здраствуйте','Приветствую Вас'];
const welcome_text='Я с радостью отвечу на любые Ваши вопросы о нашей Компании. Если Вам нужно получить какую-либо информацию, просто напишите мне об этом.';
const welcome_run=['Чем могу Вам помочь?','Что Вас интересует?','Что Вы хотите узнать?'];
//
bot.telegram.getMe().then((botinfo)=>{console.log('Бот: '+botinfo.username)});
function getRegExp(cmd){cmd='(^| )('+cmd+')($| )';return new RegExp(cmd,'gi')}

function getWeather(res,callback){var icons=['☀️','⛅','☁️','☁️','','','','','🌧️','🌧️','⛈️','','🌨️'];
let url='http://api.openweathermap.org/data/2.5/forecast?units=metric&id=625324&lang=ru&cnt=2&appid=120d8e812822f02a0cc953ee4efdb863';
request(url,function(err,response,body){if(err){var ret='Сервис погоды не доступен.'}else{var w=JSON.parse(body);
l=w.list[res];var icon=l.weather[0].icon;var ret=icons[Number(icon.slice(0,2)-1)]+l.weather[0].description;
ret+=', температура '+l.main.temp+'°C, влажность '+l.main.humidity+'%, ветер ';var d=l.wind.deg;
if(d>337.5)ret+='⬇️';else if(d>292.5)ret+='↘️';else if(d>247.5)ret+='➡️';else if(d>202.5)ret+='↗️';
else if(d>157.5)ret+='⬆️';else if(d>122.5)ret+='↖️';else if(d>67.5)ret+='⬅️';else if(d>22.5)ret+='↙️';else if(d>0) ret+='⬇️';else ret+='';
ret+=l.wind.speed+' м/с', облачность '+l.clouds.all+'%.'}callback(err,ret)})}

bot.start((ctx)=>{console.log('User:',ctx.from.first_name+' '+ctx.from.last_name);
return ctx.reply(welcome_hi[Math.floor(Math.random()*welcome_hi.length)]+', '+ctx.from.first_name+' '+ctx.from.last_name+'!👋')
.then(()=>ctx.reply(welcome_text)).then(()=>{ctx.reply(welcome_run[Math.floor(Math.random()*welcome_run.length)])})});

bot.on('text',(ctx)=>{let cmd=ctx.message.text.toLowerCase();
if(cmd=='1'){
return getWeather(0,function(err,ret){ctx.reply('Сейчас '+ret);getWeather(1,function(err,ret){ctx.reply('В ближайшие три часа будет '+ret)});});
}
return ctx.reply(cmd)
});
bot.on('message',(ctx)=>ctx.reply('Вводите только текст, пожалуйста😞.'));

bot.use(session());
bot.startPolling();
