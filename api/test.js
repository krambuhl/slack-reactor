const sendEvent = require('../lib/sendEvent')

module.exports = (req, res) => {
  sendEvent({
    type: 'test',
    user: 'test_user',
    item_user: 'test_item_user',
    reaction: 'happy_face'
  })

  res.status(200).json({ success: true })
}
