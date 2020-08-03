const pusher = require('./pusher')

function sendEvent(event) {
  const { type, user, item_user, reaction } = event

  console.log({ type, user, item_user, reaction })

  pusher.trigger('emoji-reaction', type, {
    user,
    item_user,
    reaction
  });
}

module.exports = sendEvent
