require('dotenv').config()

const { PORT } = process.env

const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')

const {
  sendCommand,
  sendEvent
} = require('./functions')

// middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// slack entries
app.post('/sendCommand', sendCommand(io))
app.post('/sendEvent', sendEvent(io))

// fallback
app.get('*', (req, res) => res.status(401).json({ error: 'Unauthorized' }))

// socket
io.on('connection', socket => {
  console.log('device connected.')
})

http.listen(PORT, () => console.log(`listening on *:${PORT}`))
