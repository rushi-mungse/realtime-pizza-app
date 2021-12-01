const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    size: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Product', menuSchema)