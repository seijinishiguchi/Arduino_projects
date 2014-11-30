$(function(){

    var serial_server = "******";

    // 1秒間隔でArduinoからセンサー出力を取得
    setInterval(function(){
        $.getJSON(serial_server, {}, function(data){
            //console.log(data);
            var sensor_output = data[0].data;

            // センサー出力に応じてクラスを追加しテキストを差し替える
            if (sensor_output === 1) {
                $('.indicate').addClass('ocupied').html('セコムまだアカンで');
            } else if (sensor_output === 0) {
                $('.indicate').removeClass('ocupied').html('セコムええで');
            }
        });
    }, 1000);
});
