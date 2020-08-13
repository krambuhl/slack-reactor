const { SLACK_VERIFICATION_TOKEN } = process.env

function handleSlackEvent(req, res, handle) {
  try {
    const { token } = req.body

    if (token === SLACK_VERIFICATION_TOKEN) {
      const { type } = req.body

      // verify to slack that we are the real deal
      if (type === 'url_verification') {
        const { challenge } = req.body
        res.status(200).json({ challenge })
      } else {
        handle(() => {
          console.log({ success: false, error: 'Unhandled Event' })
          res.status(400).json({ success: false, error: 'Unhandled Event' })
        })
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

module.exports = handleSlackEvent
