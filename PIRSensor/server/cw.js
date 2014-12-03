var request = require('request');
var room_id = '{room id number}';
var options = {
    headers: {
        'X-ChatWorkToken': '{chatwork api token}'
    },
    from: [],
    json: true
};
var serial_server = {
   url: 'http://localhost:{port-number}',
   from: [],
   json: true
};
var sensor_output;

function getMessages(callback){
    options.url = 'https://api.chatwork.com/v1/rooms/'+room_id+'/messages?force=0';
    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body);
        }else{
            console.log('message_get_error: '+ response.statusCode);
            callback(false);
        }
    });
}

function postMessage(message, callback){
    options.url = 'https://api.chatwork.com/v1/rooms/'+room_id+'/messages';
    options.form = { body: message };
    request.post(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body);
        }else{
            console.log('message_post_error: '+ response.statusCode);
            callback(false);
        }
    });
}

//センサー出力を0.1秒間隔で取得(Arduinoも0.1秒間隔で取得している)
var serial_communication = function(){
    request.get(serial_server, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);
            sensor_output = body[0].data;
        }else{
            console.log('sensor_error: '+ response.statusCode);
            sensor_output =  undefined;
        }
    });
    setTimeout(serial_communication, 100);
};
serial_communication();

// 5秒間隔でメッセージを取得
var bot_processing = function(){
    var ask_pattern_1 = 'おるか？',
        ask_pattern_2 = 'セコムええか？';

    //メッセージ取得
    getMessages(function(messages){
        if(!Array.isArray(messages))return;
        //console.log('check:',messages);
        //console.log('sensor output is ' + sensor_output);

        //未読メッセージ分繰り返し
        messages.map(function(message) {
            var body = message.body;
            console.log(body);
            var result = '[To:' + message.account.account_id + '] ' + message.account.name + 'さん\n';

            //ask_patternとマッチしたらセンサー入力に応じて返信メッセージ result をセット
            if(body.indexOf(ask_pattern_1) != -1) {
                if (sensor_output === 1) {
                    result += 'おるで';
                } else if (sensor_output === 0) {
                    result += 'おらんで';
                } else {
                    result += '自分で確認してやー';
                }
            } else if (body.indexOf(ask_pattern_2) != -1){
                if (sensor_output === 1) {
                    result += 'セコムまだアカンで';
                } else if (sensor_output === 0) {
                    result += 'セコムええで';
                } else {
                    result += '自分で確認してやー';
                }
            } else {
                return;
            }
            return result;
        }).filter(function(message) {
            //mapでreturn;した要素を排除
            return message;
        }).forEach(function(message) {
            postMessage(message, function(data){
                if(!data)return;
                console.log(data);
            });
        });
    });
    setTimeout(bot_processing, 5000);
};
bot_processing();
