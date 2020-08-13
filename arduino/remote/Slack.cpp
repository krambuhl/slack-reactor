#include "Slack.h"

SlackHelper::SlackHelper(char* user) {
  selected_user = user;
}

int SlackHelper::handleEvent(const char * payload) {
  DynamicJsonDocument doc(2048);
  DeserializationError error = deserializeJson(doc, payload);

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return -1;
  }

  const char* type = doc["type"];
  if (strcmp(type, "reaction_added") == 0) {
    const char* reaction = doc["reaction"];

    Serial.print("Reaction: ");
    Serial.println(reaction);
    return 1;
  }
}

int SlackHelper::handleCommand(const char * payload) {
  DynamicJsonDocument doc(2048);
  DeserializationError error = deserializeJson(doc, payload);

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return -1;
  }

  const char* command = doc["command"];
  if (strcmp(command, "highfive") == 0) {
    const char* user = doc["args"];

    if (strcmp(user, selected_user) == 0) {
      Serial.print("Highfive: ");
      Serial.println(user);
      return 1;
    }
  }
}
