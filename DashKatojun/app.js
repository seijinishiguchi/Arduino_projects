/// <reference path="typings/tsd.d.ts" />
var DashKatojun;
(function (DashKatojun) {
    var request = require('request');
    var ChatworkBot = (function () {
        function ChatworkBot() {
            this.ROOM_ID = '29929087';
            this.MESSAGE = 'なに';
            this.options = {
                headers: {
                    'X-ChatWorkToken': 'edfa1fcab07c02a4cbe7889dbfd4867e'
                },
                url: '',
                form: { body: this.MESSAGE },
                from: [],
                json: true
            };
            this.is_posting = false;
        }
        ChatworkBot.prototype.process = function () {
            var SERIAL_SERVER = {
                url: 'http://localhost:8783',
                from: [],
                json: true
            };
            request.get(SERIAL_SERVER, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body[0].data && !this.is_posting) {
                        this.is_posting = true;
                        this.postMessage(function (data) {
                            if (!data) {
                                return;
                            }
                            console.log(data);
                        });
                        setTimeout(function () {
                            this.is_posting = false;
                        }, 3000);
                    }
                }
                else {
                    console.log('sensor_error: ' + response.statusCode);
                    return;
                }
            });
        };
        ChatworkBot.prototype.postMessage = function (callback) {
            if (!this.is_posting) {
                this.is_posting = true;
                this.options.url = 'https://api.chatwork.com/v1/rooms/' + this.ROOM_ID + '/messages';
                request.post(this.options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        callback(body);
                    }
                    else {
                        console.log('message_post_error: ' + response.statusCode);
                        callback(false);
                    }
                });
                setTimeout(function () {
                    this.is_posting = false;
                }, 3000);
            }
        };
        return ChatworkBot;
    })();
    DashKatojun.ChatworkBot = ChatworkBot;
})(DashKatojun || (DashKatojun = {}));
var dash_katojun = new DashKatojun.ChatworkBot();
dash_katojun.process();
//# sourceMappingURL=app.js.map