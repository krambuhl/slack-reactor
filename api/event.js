const sendCommand = require('../lib/sendCommand')
const sendEvent = require('../lib/sendEvent')

const { SLACK_VERIFICATION_TOKEN } = process.env

module.exports = (req, res) => {
  try {
    const { token } = req.body

    if (token === SLACK_VERIFICATION_TOKEN) {
      const { type, command } = req.body

      console.log(req.body)

      // verify to slack that we are the real deal
      if (type === 'url_verification') {
        const { challenge } = req.body
        res.status(200).json({ challenge })
      }

      // send events
      else if (type === 'event_callback') {
        const { event } = req.body
        sendEvent(event)
          .then(() => res.sendStatus(200))
          .catch(() => res.sendStatus(500))
      }

      // send commands
      else if (command !== undefined) {
        sendCommand(req.body)
          .then(() => res.sendStatus(200))
          .catch(() => res.sendStatus(500))
      }

      // catch everything else
      else {
        console.log({ success: false, error: 'Unhandled Event' })
        res.status(400).json({ success: false, error: 'Unhandled Event' })
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
