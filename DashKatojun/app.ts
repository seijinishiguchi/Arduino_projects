/// <reference path="typings/tsd.d.ts" />

module DashKatojun {

    declare function require(x:string):any;
    var request = require('request');

    export class ChatworkBot {
        ROOM_ID = '29929087';
        MESSAGE = 'なに';
        options = {
            headers: {
                'X-ChatWorkToken': 'edfa1fcab07c02a4cbe7889dbfd4867e'
            },
            url: '',
            form: { body: this.MESSAGE },
            from: [],
            json: true
        };

        is_posting = false;

        public process():void {

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
                        setTimeout(function() {
                            this.is_posting = false;
                        },3000);
                    }
                } else {
                    console.log('sensor_error: ' + response.statusCode);
                    return;
                }
            });
        }

        postMessage(callback):void {
            if(!this.is_posting) {
                this.is_posting = true;
                this.options.url = 'https://api.chatwork.com/v1/rooms/' + this.ROOM_ID + '/messages';
                request.post(this.options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        callback(body);
                    } else {
                        console.log('message_post_error: ' + response.statusCode);
                        callback(false);
                    }
                });
                setTimeout(function() {
                    this.is_posting = false;
                },3000);
            }
        }
    }
}

var dash_katojun = new DashKatojun.ChatworkBot();
dash_katojun.process();