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

//mongoose connection
function DbConnected() {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('DB Connected..')
    });
}
DbConnected()

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

//globle middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    next()
})
app.use(ejsLayouts)
app.set('views', path.join(__dirname, 'resources/views'))
app.set('view engine', 'ejs')
app.use(express.json())

//route
require('./routes/web')(app)

//create server using express
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})