const token=require('../token');
const telegraf=require('telegraf');
const session=require('telegraf/session');
const markup=require('telegraf/markup');
const request=require('request');
const bot=new telegraf(token.TOKEN);

const Stage=require('telegraf/stage');
const Scene=require('telegraf/scenes/base');
const {enter,leave}=Stage;
const fs=require('fs');
const nodemailer=require('nodemailer'); 
//
const welcome_hi=['Привет,','Здраствуйте,','Приветствую Вас,','Добро пожаловать,'];
const welcome_text='Я с радостью отвечу на любые вопросы о нашей Компании. Если Вам нужно получить какую-либо информацию, просто напишите мне об этом.';
const welcome_run=['Чем могу Вам помочь?','Что Вас интересует?','Что Вы хотите узнать?'];
const reply_text=['Хотите что-то еще узнать?'];
const error_text=['Не могу понять, что Вы имели ввиду.','Можете сказать то же самое другими словами?','Не понял Вас.😞','Сформулируйте Ваш вопрос иначе.'];

const replies=require('./replies');
const feedback=new Scene('feedback');
feedback.enter((ctx)=>ctx.reply('Напишите Ваши пожелания, замечания или вопросы, и я перешлю их своим создателям.📩'));
feedback.hears(/отмена/gi,(ctx)=>{ctx.reply('Буду рад передать пожелания, замечания или вопросы от Вас в любое время!😊');ctx.scene.leave()});
feedback.on('text',(ctx)=>{ctx.reply('Спасибо! Вам ответят в ближайшее время.🤗');ctx.scene.leave()});

const stage=new Stage([feedback],{ttl:300});bot.command('feedback',enter('feedback'));
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

bot.start((ctx)=>{console.log('User:',ctx.from.first_name+' '+ctx.from.last_name+', Id: '+ctx.from.id);
return ctx.reply(welcome_hi[Math.floor(Math.random()*welcome_hi.length)]+' '+ctx.from.first_name+' '+ctx.from.last_name+'!👋')
.then(()=>ctx.reply(welcome_text)).then(()=>{ctx.reply(welcome_run[Math.floor(Math.random()*welcome_run.length)])})});

function reply(ctx,i,callback){var r=replies[i].value;if(typeof r==='object')r=r[Math.floor(Math.random()*r.length)];
if(replies[i].type==='photo'){var rr={caption:replies[i].caption};r={source:fs.createReadStream(r)}}
else if(replies[i].type==='document'){var rr={caption:replies[i].caption};r={source:fs.createReadStream(r)}}
else if(replies[i].type==='location'){var rr=replies[i].longitude;r=replies[i].latitude}
if(i==='weather'){return getWeather(0,function(err,ret){ctx.reply('Сейчас '+ret);getWeather(1,function(err,ret){ctx.reply('В ближайшие три часа будет '+ret)})})}                                            
var replyMethod={text:ctx.reply,document:ctx.replyWithDocument,photo:ctx.replyWithPhoto,location:ctx.replyWithLocation}[replies[i].type];
if(replies[i].reply==='0')return replyMethod(r,rr);
else return replyMethod(r,rr).then(()=>{ctx.reply(reply_text[Math.floor(Math.random()*reply_text.length)])});}
bot.on('text',(ctx)=>{let cmd=ctx.message.text.toLowerCase();console.log(ctx.from.first_name+' '+ctx.from.last_name+'->'+ctx.message.text);
for(var i in replies){if(cmd.search(getRegExp(replies[i].text))>-1){return reply(ctx,i).then(()=>{if(typeof replies[i].next==='string'){reply(ctx,replies[i].next)}})}}
return ctx.reply(error_text[Math.floor(Math.random()*error_text.length)])});
bot.on('message',(ctx)=>ctx.reply('Вводите только текст, пожалуйста.😞'));bot.use(session());bot.use(stage.middleware());bot.startPolling();
