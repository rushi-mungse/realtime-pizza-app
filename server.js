//import express function
require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

const path = require('path')
const ejs = require('ejs')
const ejsLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')


app.use(express.static('public'))
app.use(ejsLayouts)
app.set('views', path.join(__dirname, 'resources/views'))
app.set('view engine', 'ejs')

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

//route
require('./routes/web')(app)

//create server using express
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})