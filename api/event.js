const sendEvent = require('../lib/sendEvent')

const { SLACK_VERIFICATION_TOKEN } = process.env

module.exports = (req, res) => {
  try {
    const { token } = req.body

    if (token === SLACK_VERIFICATION_TOKEN) {
      const { event, type, challenge, ...rest } = req.body

      console.log(req.body)

      // verify to slack that we are the real deal
      if (type === 'url_verification') {
        res.status(200).json({ challenge })
      }

      // handle event
      if (type === 'event_callback') {
        sendEvent(event)
          .then(() => res.status(200).json({ success: true }))
          .catch(() => res.status(500).json({ success: false }))
      }
    } else {
      console.log({ success: false, error: 'Unauthorized' })
      res.status(401).json({ success: false, error: 'Unauthorized' })
    }
  } catch (err) {
    console.log({ success: false, error: 'Bad Request' })
    res.status(400).json({ success: false, error: 'Bad Request' })
  }
}
