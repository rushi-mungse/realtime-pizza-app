//import express function
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

const path = require('path')
const ejs = require('ejs')
const ejsLayouts = require('express-ejs-layouts')


app.use(express.static('public'))
app.use(ejsLayouts)
app.set('views', path.join(__dirname, 'resources/views'))
app.set('view engine', 'ejs')

//route
require('./routes/web')(app)

//create server using express
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})