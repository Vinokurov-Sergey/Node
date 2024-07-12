const express = require('express')
const cookieParser = require('cookie-parser')
const {socketServer} = require('./services/socket.service')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const fileStore = require('session-file-store')(session)

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'build')))
app.use('/', express.static(path.join(__dirname, 'build')))
app.use(express.static(path.join(__dirname, 'uploads')))

app.use(session({
    store: new fileStore(),
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())

const server = require('http').Server(app)
const io = require('socket.io')(server, {allowEIO3: true})
io.on('connection', socketServer)

app.use(cookieParser())
app.use('/api', require(path.join(__dirname, 'api')))
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})

server.listen(3000, () => {console.log('Сервер запущен')})