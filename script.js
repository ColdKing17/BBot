const TelegramBot = require('node-telegram-bot-api');
const sqlite = require('sqlite-sync');
const schedule = require('node-schedule');

const token = '740192874:AAG7SAAtsT3d-dOcSL3rTAAG1FCAOW0D2-c';
const bot = new TelegramBot(token, {polling: true});
sqlite.connect('database.db');


////////////variables///////////
var data;
let dickLength;
let money;
let isChecked;

let increaseTime;
let decreaseTime;
let fortuneTime;
let depositTime;
let iconTime;
let collectorsTime;
let clickTime; 

let minDick;
let moneyGives;
let icona;

let increasePrice;
let decreasePrice;
let fortunePrice;
let depositPrice;
let iconPrice;
let collectorsPrice;
let clickPrice;

let increaseValue;
let decreaseValue;
let fortuneValue;
let depositValue;
//////////////////////////////


var everyS = schedule.scheduleJob('0 0 0 * * *', function(){
  var isCheckedTable = sqlite.run("SELECT * FROM IsChecked");
  for (var i = 0; i <= isCheckedTable.length; i++) {
    sqlite.update("IsChecked", {isCheck: true}, isCheckedTable[i]);
  }
});

function update(msg) {
  if (isInTable(msg)) {
    bot.sendMessage(msg.chat.id, '<b>'+msg.from.first_name+'</b>, вы начали игру "Песюн"', {
      reply_to_message_id: msg.message_id, 
      parse_mode: 'HTML'
    });

    sqlite.run("CREATE TABLE IF NOT EXISTS IsChecked (ID INTEGER PRIMARY KEY, IsCheck BOOL);");
    sqlite.insert("IsChecked", {ID: msg.from.id, isCheck: true});

    sqlite.run("CREATE TABLE IF NOT EXISTS Chat"+Math.abs(msg.chat.id)+" (ID INTEGER PRIMARY KEY,\
      dickLength INTEGER,\
      userName TEXT,\
      money INTEGER,\
      \
      increaseTime INTEGER,\
      decreaseTime INTEGER,\
      fortuneTime INTEGER,\
      depositTime INTEGER,\
      iconTime INTEGER,\
      collectorsTime INTEGER,\
      clickTime INTEGER,\
      \
      minDick INTEGER,\
      moneyGives INTEGER,\
      icona BOOL);");
    
    sqlite.insert("Chat"+Math.abs(msg.chat.id), {ID: msg.from.id, dickLength: 0, userName: msg.from.first_name, money: 0, increaseTime: 0, decreaseTime: 0, fortuneTime: 0, depositTime: 0, iconTime: 0, collectorsTime: 0, clickTime: 0, minDick: -5, moneyGives: 1, icona: false});
  }

  data = sqlite.run("SELECT * FROM Chat"+Math.abs(msg.chat.id)+" WHERE ID = "+msg.from.id)[0];
  isCheckedTable = sqlite.run("SELECT * FROM IsChecked WHERE ID = "+msg.from.id)[0];
  
  dickLength = data.dickLength;
  money = data.money;
  isChecked = isCheckedTable.IsCheck;

  increaseTime = data.increaseTime;
  decreaseTime = data.decreaseTime;
  fortuneTime = data.fortuneTime;
  depositTime = data.depositTime;
  iconTime = data.iconTime;
  collectorsTime = data.collectorsTime;
  clickTime = data.clickTime;

  minDick = data.minDick;
  moneyGives = data.moneyGives;
  icona = data.icona;

  increasePrice = (increaseTime+1) * 5;
  decreasePrice = (decreaseTime+1) * 5;
  fortunePrice = (fortuneTime==0?10:fortuneTime*15+10);
  depositPrice = (depositTime==0?15:depositTime*10+15);
  iconPrice = (iconTime==0?15:iconTime*5+15);
  collectorsPrice = (collectorsTime==0?10:collectorsTime*15+10);
  clickPrice = (clickTime+1) * 100;

  increaseValue = (increaseTime+1) * 5;
  decreaseValue = (decreaseTime+1) * 8;
  fortuneValue = (fortuneTime==0?0:fortuneTime*2);
  depositValue = (depositTime==0?0:depositTime*0.5);
}
///////////////////////////////







bot.on('message', (msg) => { 
  const chatId = msg.chat.id;
  const text = msg.text;
  const userId = msg.from.id;

  if (text == '/start_dick@servetnikBot' || text == '/start_dick') { //Start game
    update(msg);
    bot.sendMessage(chatId, 'BBot', {
      reply_to_message_id: msg.message_id,
      parse_mode: 'HTML',
      reply_markup: {
        resize_keyboard: true,
  
        keyboard: [
          [
            {
              text: '📏Play',
              callback_data: 'play'
            }
          ],
          [
            {
              text: '📊Top',
              callback_data: 'top'
            },
            {
              text: '🏦Shop',
              callback_data: 'shop'
            },
            {
              text: '🔍Rules',
              callback_data: 'rules'
            }
          ]
        ]
      }
    });
}
  
  else if (text == '/stickers@servetnikBot' || text == '/stickers') { //Stickers
    bot.sendMessage(chatId, '<b>Стикеры:</b> https://t.me/addstickers/servetnik', {
      reply_to_message_id: msg.message_id, 
      parse_mode: 'HTML'
    });
  }

  else if (text == '/help@servetnikBot' || text == '/help') { //Help
    bot.sendMessage(chatId, '<b>Помощь:</b>\n\n'+
      'Команды:\n'+
      '/play_dick - Начать в игру "Песюн"\n'+  
      '    Play - Сыграть в игру "Песюн"\n'+
      '    Top - Топ игроков в игре "Песюн"\n'+
      '    Shop - Магазин игры "Песюн"\n'+
      '    Rules - Правила игры "Песюн"\n'+
      
      '/stickers - Получить стикеры\n'+

      '/help - Получить помощь\n\n'+
      
      'GitGub: https://github.com/ColdKing17', {
      reply_to_message_id: msg.message_id, 
      parse_mode: 'HTML'
    });
  }



  else if (text == '📏Play') { //Play
    update(msg);
    if (isChecked) {
      let resultDickNum = randomNum(-5+fortuneValue, 10, true);
      sqlite.update('Chat'+Math.abs(msg.chat.id), {dickLength: dickLength+=resultDickNum, money: money+=1+depositValue}, {ID: userId});

      bot.sendMessage(msg.chat.id, '<b>'+msg.from.first_name+'</b>, ваш песюн '+(resultDickNum>0?'увеличился':'уменшился')+' на '+Math.abs(resultDickNum)+'см. теперь его длина:'+dickLength+'см. И вы получили '+(1+depositValue)+'грн. у вас теперь: '+money+'грн.', {
        reply_to_message_id: msg.message_id, 
        parse_mode: 'HTML'
      });

      sqlite.update("IsChecked", {isCheck: false}, {id: userId});
    } else {
      bot.sendMessage(msg.chat.id, '<b>'+msg.from.first_name+'</b>, вы уже играли сегодня', {
        reply_to_message_id: msg.message_id, 
        parse_mode: 'HTML'
      });
    }
  }

  else if (text == '🏦Shop') { //Shop catalog
    update(msg);
    bot.sendMessage(msg.chat.id, '<b>Магазин:</b>\n\n'+
    '<i>Увеличение</i> - '+increasePrice+'грн.\n'+
    '    Увеличивает вам песюн на '+increaseValue+'см. \n'+
    '    Чтобы купить: /increase \n\n'+
    
    '<i>Уменьшение</i> - '+decreasePrice+'грн.\n'+
    '    Уменшает любому игроку из группы песюн на '+decreaseValue+'см. \n'+
    '    Чтобы купить: /decrease \n\n'+
    
    '<i>Фортуна</i> - '+fortunePrice+'грн.\n'+
    '    Увеличивает вам шанс увеличения песюна\n'+
    '    Чтобы купить: /fortune \n\n'+
    
    '<i>Депозит</i> - '+depositPrice+'грн.\n'+
    '    Увеличивает вам количество видачи грн. \n'+
    '    Чтобы купить: /deposit \n\n'+
    
    '<i>Икона</i> - '+iconPrice+'грн.\n'+
    '    Защищает вас от чужих ??? \n'+
    '    Чтобы купить: /icon \n\n'+
    
    '<i>Коллекторы</i> - '+collectorsPrice+'грн.\n'+
    '    Заберает все грн. у любого игрока из группы \n'+
    '    Чтобы купить: /collectors \n\n'+
    
    '<i>Щелчок Таноса</i> - '+clickPrice+'грн.\n'+
    '    Анулирует размер песюна у половини игроков из группы (кроме вас) \n'+
    '    Чтобы купить: /click', {
      reply_to_message_id: msg.message_id, 
      parse_mode: 'HTML'
    });
  }

  else if (text == '📊Top') { //Top
    update(msg);
    let table = sqlite.run("SELECT * FROM Chat"+Math.abs(msg.chat.id));
    let top = '';
    let arr;
    arr = table.sort(function(a, b) {
      return b.dickLength - a.dickLength;
    });

    for (var i = 0; i < arr.length; i++) {
      top += i+1+'. '+arr[i].userName+' - '+arr[i].dickLength+'см. '+arr[i].money+'грн. \n\n'
    }

    bot.sendMessage(chatId, '<b>Топ:</b>\n\n'+top, {
      reply_to_message_id: msg.message_id, 
      parse_mode: 'HTML'});
  }

  else if (text == '🔍Rules') { //Rules
    bot.sendMessage(chatId, '<b>Правила:</b>\n\n'+
    'Смысл:\n'+
    'Игра "Песюн" - это развлекательная игра, смысл которой заключается в том, чтобы набрать самый большой Песюн.\n\n'+
    
    'Как играть:\n'+
    'Каждый день, вы можете сыграть в эту игру и увеличить/уменьшить размер своего\
    пениса(число выберется рандомно, от -5, до +10). Также вам начисляется гривна, которую вы сможете потратить в магазине.', {
      reply_to_message_id: msg.message_id, 
      parse_mode: 'HTML'
    });
  }

  
  else if (text == '/increase') {
    update(msg);
    if (increasePrice <= money) {
      sqlite.update('Chat'+Math.abs(msg.chat.id), {increaseTime: increaseTime+1, money: money-=increasePrice, dickLength: dickLength+=increaseValue}, {ID: userId});

      bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, ваш песюн увеличился на '+increaseValue+'см. Теперь его длинна: '+dickLength+'см. Вы потратили '+increasePrice+'грн. Теперь у вас: '+money+'грн.', {
        reply_to_message_id: msg.message_id, 
        parse_mode: 'HTML'
      });
    } else {
      bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, у вас недостаточно денег', {
        reply_to_message_id: msg.message_id, 
        parse_mode: 'HTML'
      });
    }
  }

  else if (text == '/decrease') {
    update(msg);
    if (decreasePrice <= money) {
      sqlite.update('Chat'+Math.abs(msg.chat.id), {decreaseTime: decreaseTime+1, money: money-=decreasePrice}, {ID: userId});

      var tableLength = sqlite.run("SELECT * FROM Chat"+Math.abs(msg.chat.id));
      var randomResult = randomNum(0, tableLength.length-1, false);

      var person = tableLength[randomResult];

      if (person.iconTime >= 1) {
        sqlite.update('Chat'+Math.abs(msg.chat.id), {iconTime: person.iconTime-1}, {ID: person.ID});
        bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, у '+person.userName+', к сожалению была икона, так что он ничего не потерял. Вы потратили '+decreasePrice+'грн. Теперь у вас: '+money+'грн.', {
          reply_to_message_id: msg.message_id, 
          parse_mode: 'HTML'
        });
      } else {
        sqlite.update('Chat'+Math.abs(msg.chat.id), {dickLength: person.dickLength-=decreaseValue}, {ID: person.ID});

        bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, у '+person.userName+' песюн уменшилься на '+decreaseValue+'см. Теперь его длинна: '+person.dickLength+'см. Вы потратили '+decreasePrice+'грн. Теперь у вас: '+money+'грн.', {
          reply_to_message_id: msg.message_id, 
          parse_mode: 'HTML'
        });
      }
    } else {
      bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, у вас недостаточно денег', {
        reply_to_message_id: msg.message_id, 
        parse_mode: 'HTML'
      });
    }
  }

  else if (text == '/fortune') {
    update(msg);
    if (fortunePrice <= money) {
      sqlite.update('Chat'+Math.abs(msg.chat.id), {fortuneTime: fortuneTime+1, money: money-=fortunePrice}, {ID: userId});

      bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, у вас увеличилось везение', { 
        reply_to_message_id: msg.message_id, 
        parse_mode: 'HTML'
      });
    } else {
      bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, у вас недостаточно денег', {
        reply_to_message_id: msg.message_id, 
        parse_mode: 'HTML'
      });
    }
  }

  else if (text == '/deposit') {
    update(msg);
    if (depositPrice <= money) {
      sqlite.update('Chat'+Math.abs(msg.chat.id), {depositTime: depositTime+1, money: money-=depositPrice}, {ID: userId});

      bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, вы будете получать больше денег', {
        reply_to_message_id: msg.message_id, 
        parse_mode: 'HTML'
      });
    } else {
      bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, у вас недостаточно денег', {
        reply_to_message_id: msg.message_id, 
        parse_mode: 'HTML'
      });
    }
  }

  else if (text == '/icon') {
    update(msg);
    if (iconPrice <= money) {
      sqlite.update('Chat'+Math.abs(msg.chat.id), {iconTime: iconTime+1, money: money-=iconPrice}, {ID: userId});
      bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, у вас появилась икона', {
        reply_to_message_id: msg.message_id, 
        parse_mode: 'HTML'
      });
    } else {
      bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, у вас недостаточно денег', {
        reply_to_message_id: msg.message_id, 
        parse_mode: 'HTML'
      });
    }
  }

  else if (text == '/collectors') { 
    update(msg);
    if (collectorsPrice <= money) {
      sqlite.update('Chat'+Math.abs(msg.chat.id), {collectorsTime: collectorsTime+1, money: money-=collectorsPrice}, {ID: userId});

      var tableLength = sqlite.run("SELECT * FROM Chat"+Math.abs(msg.chat.id));
      var randomResult = randomNum(0, tableLength.length-1, false);

      var person = tableLength[randomResult];

      if (person.iconTime >= 1) {
        sqlite.update('Chat'+Math.abs(msg.chat.id), {iconTime: person.iconTime-1}, {ID: person.ID});
        bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, у '+person.userName+', к сожалению была икона, так что он ничего не потерял. Вы потратили '+collectorsPrice+'грн. Теперь у вас: '+money+'грн.', {
          reply_to_message_id: msg.message_id, 
          parse_mode: 'HTML'
        });
      } else {
        sqlite.update('Chat'+Math.abs(msg.chat.id), {money: 0}, {ID: person.ID});

        bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, к '+person.userName+' пришли коллектори', {
          reply_to_message_id: msg.message_id, 
          parse_mode: 'HTML'
        });
      }
    } else {
      bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, у вас недостаточно денег', {
        parse_mode: 'HTML'
      });
    }
  }

  else if (text == '/click') {
    update(msg);

    var tableLength = sqlite.run("SELECT * FROM Chat"+Math.abs(msg.chat.id));
    if (tableLength.length < 2) {
      console.log(123)
      bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, в группе только 1 человек', {
        reply_to_message_id: msg.message_id, 
        parse_mode: 'HTML'
      });
      return false;
    }

    if (clickPrice <= money) {

      sqlite.update('Chat'+Math.abs(msg.chat.id), {clickTime: clickTime+1, money: money-=clickTime}, {ID: userId});
      let killed = '';
      
      var tableLength = sqlite.run("SELECT * FROM Chat"+Math.abs(msg.chat.id));
      var lengthLeft = Math.floor(tableLength.length/2);
      while (lengthLeft != 0) {
        var randomResult = randomNum(0, tableLength.length-1, false);
        var person = tableLength[randomResult];
        if (person.ID != userId) {
          if (person.iconTime >= 1) {
            sqlite.update('Chat'+Math.abs(msg.chat.id), {iconTime: person.iconTime-1}, {ID: person.ID});
            bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, у '+person.userName+', к сожалению была икона, так что он ничего не потерял. Вы потратили '+collectorsPrice+'грн. Теперь у вас: '+money+'грн.', {
              reply_to_message_id: msg.message_id, 
              parse_mode: 'HTML'
            });
          } else {
            killed += person.userName+'; ';
            sqlite.delete("Chat"+Math.abs(msg.chat.id), {ID: person.ID});
          }
        }
        lengthLeft--;
      }
      bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, '+killed+' превратилась в пепел', {
        reply_to_message_id: msg.message_id, 
        parse_mode: 'HTML'
      });
    } else {
      bot.sendMessage(chatId, '<b>'+msg.from.first_name+'</b>, у вас недостаточно денег', {
        reply_to_message_id: msg.message_id, 
        parse_mode: 'HTML'
      });
    }
  }
});




function randomNum(min, max, isNull) {
  let result = Math.floor(Math.random() * (max+1 - min) + min); //Random num in range from "min" to "max"
    
    if (isNull) {
      if (result == 0) {
        return randomNum(min, max, true);
      } else {
        return result;
      }
    }
    return result;
}

function isInTable(msg) {
  chatId = msg.chat.id;
  userId = msg.from.id;

  var table = sqlite.run("SELECT * FROM Chat"+Math.abs(msg.chat.id)+" WHERE ID = "+userId);
  if (!table.length) {
    return true;
  }
  return false;
}

bot.on("message", (msg) => {
  if (msg.text == "/delete") {
    bot.getChatMember(msg.chat.id, msg.from.id).then(function(data) {
      if ((data.status == "creator")){
        var table = sqlite.run("SELECT * FROM Chat"+Math.abs(msg.chat.id));
        for (var i = 0; i <= table.length; i++) {
          sqlite.delete("Chat"+Math.abs(msg.chat.id), table[i]);
        }
        bot.sendMessage(msg.chat.id, "Игра была перезапущена");
      }else{
        bot.sendMessage(msg.chat.id, "Вы не создатель");
      }
    });
  }
});