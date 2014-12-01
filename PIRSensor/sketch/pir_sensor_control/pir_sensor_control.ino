int led_pin = 13;
int pir_pin = 8;
int pir_read;

void setup(){
    pinMode(led_pin, OUTPUT);
    pinMode(pir_pin, INPUT);
    Serial.begin(9600);
}

void loop(){
    pir_read = digitalRead(pir_pin);
    digitalWrite(led_pin, pir_read);
    Serial.println(pir_read);
    delay(100);
}
