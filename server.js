//import express function
require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

const path = require('path')
const ejs = require('ejs')
const ejsLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const Emitter = require('events')

//mongoose connection
function DbConnected() {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('DB Connected..')
    });
}
DbConnected()
//Emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// set session
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        collectionName: 'sessions',
    }),
}))

app.use(flash())
app.use(express.static('public'))

//passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

//globle middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})
app.use(ejsLayouts)
app.set('views', path.join(__dirname, 'resources/views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
global.appRoot = path.resolve(__dirname)

//route
require('./routes/web')(app)
app.use('/uploads',express.static('uploads'))
//create server using express
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

//socket connection
const io = require('socket.io')(server)

io.on('connection', (socket) => {
    socket.on('join', (orderId) => {
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('newOrder', data)
})