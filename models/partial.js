const mongoose = require('mongoose')

const partialSchema = new mongoose.Schema({
    filename: String,
    url: String,
    name: String
})

module.exports = mongoose.model('Partial', partialSchema)
