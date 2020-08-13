const handleSlackEvent = require('./lib/handleSlackEvent')

exports.sendCommand = (io) => (req, res) => {
  handleSlackEvent(req, res, (catchUnhandledEvent) => {
    const { command, text: args } = req.body

    if (command !== undefined) {
      io.emit('slack-command', { command: command.substr(1), args })
      res.status(200).send('Command sent!')
    } else {
      catchUnhandledEvent()
    }
  })
}

exports.sendEvent = (io) => (req, res) => {
  handleSlackEvent(req, res, (catchUnhandledEvent) => {
    const { type, event } = req.body

    if (type === 'event_callback') {
      io.emit('slack-event', event)
      res.status(200).json(event)
    } else {
      catchUnhandledEvent()
    }
  })
}
