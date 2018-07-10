const token=require('../token');
const telegraf=require('telegraf');
const session=require('telegraf/session');
const markup=require('telegraf/markup');
const request=require('request');
const fs=require('fs');
const bot=new telegraf(token.TOKEN);
//
const welcome_hi=['Привет','Здраствуйте','Приветствую Вас','Добро пожаловать'];
const welcome_text='Я с радостью отвечу на любые Ваши вопросы о нашей Компании. Если Вам нужно получить какую-либо информацию, просто напишите мне об этом.';
const welcome_run=['Чем могу Вам помочь?','Что Вас интересует?','Что Вы хотите узнать?'];
const reply_text=['Хотите что-то еще узнать?'];
const error_text=['Не могу понять, что вы имели ввиду.','Можете сказать то же самое другими словами?','Не понял вас.😞','Сформулируйте Ваш вопрос иначе.'];

const replies=require('./replies');
//
bot.telegram.getMe().then((botinfo)=>{console.log('Бот: '+botinfo.username)});
function getRegExp(cmd){cmd='(^| )('+cmd+')($| )';return new RegExp(cmd,'gi')}

function getWeather(res,callback){var icons=['☀️','⛅','☁️','☁️','','','','','🌧️','🌧️','⛈️','','🌨️'];
let url='http://api.openweathermap.org/data/2.5/forecast?units=metric&id=625324&lang=ru&cnt=2&appid=120d8e812822f02a0cc953ee4efdb863';
request(url,function(err,response,body){if(err){var ret='Сервис погоды не доступен.'}else{var w=JSON.parse(body);
l=w.list[res];var icon=l.weather[0].icon;var ret=l.weather[0].description+icons[Number(icon.slice(0,2)-1)];
ret+=', температура '+l.main.temp+'°C, влажность '+l.main.humidity+'%, ветер ';var d=l.wind.deg;
if(d>337.5)ret+='⬇️';else if(d>292.5)ret+='↘️';else if(d>247.5)ret+='➡️';else if(d>202.5)ret+='↗️';
else if(d>157.5)ret+='⬆️';else if(d>122.5)ret+='↖️';else if(d>67.5)ret+='⬅️';else if(d>22.5)ret+='↙️';else if(d>0) ret+='⬇️';else ret+='';
ret+=l.wind.speed+' м/с, облачность '+l.clouds.all+'%.'}callback(err,ret)})}

bot.start((ctx)=>{console.log('User:',ctx.from.first_name+' '+ctx.from.last_name);
return ctx.reply(welcome_hi[Math.floor(Math.random()*welcome_hi.length)]+', '+ctx.from.first_name+' '+ctx.from.last_name+'!👋')
.then(()=>ctx.reply(welcome_text)).then(()=>{ctx.reply(welcome_run[Math.floor(Math.random()*welcome_run.length)])})});

bot.on('text',(ctx)=>{let cmd=ctx.message.text.toLowerCase();
console.log(ctx.from.first_name+' '+ctx.from.last_name+'->'+ctx.message.text);
for(var i in replies){
    if(cmd.search(getRegExp(replies[i].text))>-1){
if(i=='firm'){
ctx.reply(' ',markup.keyboard([['Мозырь','Калинковичи'],['Минск','Гомель','Пинск'],['Бобруйск','Светлогорск']]).oneTime().resize().extra())
}
        
        
    	var r=replies[i].value;if(typeof r=='object')r=r[Math.floor(Math.random()*r.length)];
    	if(i=='weather'){return getWeather(0,function(err,ret){ctx.reply('Сейчас '+ret);getWeather(1,function(err,ret){ctx.reply('В ближайшие три часа будет '+ret)})})}                                                
    	var replyMethod={text:ctx.reply,document:ctx.replyWithDocument,photo:ctx.replyWithPhoto}[replies[i].type];
        if(replies[i].reply==0)return replyMethod(r);
    	else return replyMethod(r).then(()=>{ctx.reply(reply_text[Math.floor(Math.random()*reply_text.length)])});
    }
}
return ctx.reply(error_text[Math.floor(Math.random()*error_text.length)]);
});
bot.on('message',(ctx)=>ctx.reply('Вводите только текст, пожалуйста.😞'));
bot.use(session());
bot.startPolling();
