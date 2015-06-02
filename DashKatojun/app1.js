var request = require('request');
var room_id = '29929087';
var options = {
    headers: {
        'X-ChatWorkToken': 'edfa1fcab07c02a4cbe7889dbfd4867e'
    },
    from: [],
    json: true
};
var serial_server = {
    url: 'http://localhost:8783',
    from: [],
    json: true
};
var is_posting = false;

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
var getData = function(){
    var sensor_output;
    request.get(serial_server, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);
            sensor_output = body[0].data;
        }else{
            console.log('sensor_error: '+ response.statusCode);
            sensor_output =  undefined;
        }

        if(sensor_output && !is_posting) {
            is_posting = true;
            postMessage('なに', function(data){
                if(!data)return;
                console.log(data);
            });
            setTimeout(function() {
                is_posting = false;
            },3000);
        }
    });
    setTimeout(getData, 100);
};
getData();
