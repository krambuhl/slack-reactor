#include <math.h>
#include <ESP8266WiFi.h>
#include <SocketIoClient.h>
#include <Adafruit_GFX.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>
#include "Slack.h"

const char* SSID = "IL7";
const char* PASSWORD = "$erver2003";
const unsigned int PANEL_SIZE = 16;
const unsigned int PIN = 5;

SocketIoClient socket;
SlackHelper slack ("@evankrambuhl");

Adafruit_NeoMatrix matrix = Adafruit_NeoMatrix(
  PANEL_SIZE, PANEL_SIZE,
  1, 1,
  PIN,
  NEO_MATRIX_ZIGZAG + NEO_TILE_PROGRESSIVE,
  NEO_GRB + NEO_KHZ800
);

unsigned long frameSize = 60;
unsigned long interval = 1000 / frameSize;  // the time we need to wait
unsigned long previousMillis = 0;
unsigned long returnMillis = 0;
unsigned long currentPass = 0;

uint16_t white = matrix.Color(255, 255, 255);
uint16_t white50 = matrix.Color(255 * 0.1, 255 * 0.1, 255 * 0.1);
uint16_t red = matrix.Color(152, 34, 30);
uint16_t blue = matrix.Color(16, 121, 203);
uint16_t violet = matrix.Color(130, 94, 184);
uint16_t yellow = matrix.Color(233, 172, 56);
uint16_t blank = matrix.Color(0, 0, 0);
 
bool connected = false;
bool active = false;

void draw(int pass) {
  for (int x = 0; x < PANEL_SIZE; x++) {
    int panelX = floor(x % PANEL_SIZE);
    for (int y = 0; y < PANEL_SIZE; y++) {
      int panelY = floor(y % PANEL_SIZE);
      drawPixel(x, y, panelX, panelY, pass);
    }
  }
}

void drawPixel(int x, int y, int panelX, int panelY, unsigned long pass) {
  int x1 = x + 1;
  int y1 = y + 1;
  int xPass = x + floor(pass * 1);
  int yPass = y + floor(pass * 2);
  int zPass = x + y + floor(pass * 1.5);

  int color1 = xPass % 255;
  int color2 = yPass % 255;
  int color3 = zPass % 255;

  uint16_t color = matrix.Color(color1, color2, color3);
  matrix.drawPixel(x, y, color);
}

void handleCommand(const char * payload, size_t length) {
  const int res = slack.handleCommand(payload);

  if (res > 0) { 
    active = true;
    returnMillis = previousMillis + 3000;
  }
}

void setup() {
  Serial.begin(115200);
  matrix.begin();
  matrix.setBrightness(255);
  matrix.fillScreen(blank);
  matrix.show();

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(SSID);

  // wifi
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  connected = true;
  digitalWrite(LED_BUILTIN, HIGH);

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  socket.on("slack-command", handleCommand);
  socket.begin("slack-reactor.ngrok.io", 80);
}

void loop() {
  if (connected) {
    socket.loop();
    
    if ((unsigned long)(millis() - previousMillis) >= interval) {
      previousMillis = millis();

      if (returnMillis < previousMillis) {
        active = false;
      }
      
      if (active) {
        draw(currentPass++); 
      } else {
        matrix.fillScreen(blank);
      }
      
      matrix.show();
    }
  }
}
