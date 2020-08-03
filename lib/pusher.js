const Pusher = require('pusher');

const {
  PUSHER_APP_ID,
  PUSHER_KEY,
  PUSHER_SECRET
} = process.env

module.exports = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: 'us3',
  encrypted: true
})
