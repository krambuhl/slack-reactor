const pusher = require('./pusher')

function sendCommand({ command, text }) {
  const message = { command: command.substr(1), args: text }

  return new Promise((resolve, reject) => {
    pusher.trigger('slack-command', command, message, (error, req, res) => {
      if (error) {
        reject(error)
      } else {
        resolve({ req, res })
      }
    })
  })
}

module.exports = sendCommand
