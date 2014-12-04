$(function(){

    var serial_server = 'http://localhost:{port-number}';

    function viewChange(sensor_output) {
        // センサー出力に応じてクラスを追加しテキストを差し替える
        if (sensor_output === 1) {
            $('.indicate').html('セコムまだアカンで');
            $('.icon').attr('src', 'image/stop.svg');
            $('body').addClass('ocupied');
        } else if (sensor_output === 0) {
            $('.indicate').html('セコムええで');
            $('.icon').attr('src', 'image/check.svg');
            $('body').removeClass('ocupied');
        }
    }

    // 1秒間隔でArduinoからセンサー出力を取得
    var getSerialData = function(){
        $.getJSON(serial_server, function() {
            console.log('success');
        })
        .done(function(serial_data) {
            //console.log('done', JSON.stringify(serial_data));
            var sensor_output = serial_data[0].data;
            viewChange(sensor_output);
        })
        .fail(function() {
            console.log( "error" );
        });
        setTimeout(getSerialData, 1000);
    };
    getSerialData();
});

