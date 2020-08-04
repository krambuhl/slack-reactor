const pusher = require('./pusher')

function sendEvent(event) {
  const { type } = event

  return new Promise((resolve, reject) => {
    pusher.trigger('slack-event', type, event, (error, req, res) => {
      if (error) {
        reject(error)
      } else {
        resolve({ req, res })
      }
    })
  })
}

module.exports = sendEvent
