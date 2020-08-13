#ifndef Slack_h
#define Slack_h

#include <ArduinoJson.h>
#include <string.h>

class SlackHelper {
  private:
    char* selected_user;
  public:
    SlackHelper(char* user);
    int handleEvent(const char * payload);
    int handleCommand(const char * payload);
};

#endif
