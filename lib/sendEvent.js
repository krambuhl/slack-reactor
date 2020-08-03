const pusher = require('./pusher')

function sendEvent(event) {
  const { type, user, item_user, reaction } = event
  const message = { user, item_user, reaction }

  console.log({ type, ...message })

  return new Promise((resolve, reject) => {
    pusher.trigger('emoji-reaction', type, message, (error, req, res) => {
      if (error) {
        reject(error)
      } else {
        resolve({ req, res })
      }
    })
  })
}

module.exports = sendEvent
