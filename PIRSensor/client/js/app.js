$(function(){

    var serial_server = '*********';

    // 1秒間隔でArduinoからセンサー出力を取得
    var serial_communication = function(){
        $.getJSON(serial_server, {}, function(data){
            //console.log(data);
            var sensor_output = data[0].data;
            console.log(sensor_output);

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
        });
        setTimeout(serial_communication, 1000);
    };
    serial_communication();
});
