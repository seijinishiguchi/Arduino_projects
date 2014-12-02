var request = require('request');
var room_id = '*****';
var options = {
    headers: {
        'X-ChatWorkToken': '******'
    },
    from: [],
    json: true
};
var serial_server = {
   url: "******",
   from: [],
   json: true
};
var sensor_output;

function getMessage(callback){
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
setInterval(function(){
    request.get(serial_server, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);
            sensor_output = body[0].data;
        }else{
            console.log('sensor_error: '+ response.statusCode);
            sensor_output =  undefined;
        }
    });
},100);

// 5秒間隔でメッセージを取得
setInterval(function(){
    var ask_pattern_1 = 'おるか？',
        ask_pattern_2 = 'セコムええか？';

    //メッセージ取得
    getMessage(function(data){
        if(!data)return;
        console.log('check:',data);
        console.log('sensor output is ' + sensor_output);

        //未読メッセージ分繰り返し
        for(var i = 0, length = data.length; i < length; i++) {
            var tmp = data[i].body;
            //発言者へのreply設定
            var reply_message = '[To:' + data[i].account.account_id + '] ' + data[i].account.name + 'さん\n';

            //ask_patternとマッチしたらセンサー入力に応じてreply_messageをセット
            if(tmp.indexOf(ask_pattern_1) != -1) {
                if (sensor_output === 1) {
                    reply_message += 'おるで';
                } else if (sensor_output === 0) {
                    reply_message += 'おらんで';
                } else {
                    reply_message += '自分で確認してやー';
                }
            } else if (tmp.indexOf(ask_pattern_2) != -1){
                if (sensor_output === 1) {
                    reply_message += 'セコムまだアカンで';
                } else if (sensor_output === 0) {
                    reply_message += 'セコムええで';
                } else {
                    reply_message += '自分で確認してやー';
                }
            } else {
                return;
            }

            postMessage(reply_message, function(data){
                if(!data)return;
                console.log(data);
            });
        }
     });
},5000);
