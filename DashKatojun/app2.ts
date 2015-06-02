/// <reference path="typings/tsd.d.ts" />

module DashKatojun {

    declare function require(x: string): any;
    var request = require('request');

    export class ChatWorkBot {
        ROOM_ID = '29929087';
        MESSAGE = 'xxx';
        options = {
            headers: {
                'X-ChatWorkToken': 'edfa1fcab07c02a4cbe7889dbfd4867e'
            },
            url: '',
            form: { body: this.MESSAGE },
            from: [],
            json: true
        };
        switch_data: boolean;
        is_posting: boolean = false;

        //ボットの処理
        process(): void {
            var SERIAL_SERVER = {
                url: 'http://localhost:8783',
                from: [],
                json: true
            };

            request.get(SERIAL_SERVER, function (error, response, body) {
                var switch_data: boolean;
                if (!error && response.statusCode === 200) {
                    if (!body[0].data) {
                        switch_data = true;
                    } else {
                        switch_data = false;
                    }
                } else {
                    console.log('sensor_error: ' + response.statusCode);
                    switch_data = false;
                }

                if (switch_data) {
                    this.postMessage(function(data) {
                        if (!data) {
                            return;
                        }
                        console.log(data);
                    });
                }
            });
            setTimeout(function() {
                this.process();
            }, 100);
        }

        //メッセージを送信
        postMessage(callback): void {
            if (!this.is_posting) {
                this.is_posting = true;
                this.options.url = 'https://api.chatwork.com/v1/rooms/' + this.ROOM_ID + '/messages';
                request.post(this.options, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        callback(body);
                    } else {
                        console.log('message_post_error: ' + response.statusCode);
                        callback(false);
                    }
                });
                setTimeout(function() {
                    this.is_posting = false;
                }, 3000);
            }
        }
    }
}

var dash_katojun = new DashKatojun.ChatWorkBot();
dash_katojun.process();
