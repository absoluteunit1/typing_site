const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TextSchema = new Schema({
    _id: Number,
    text: String
});

const TextBlob = mongoose.model('TextBlob', TextSchema, "Text");
module.exports = TextBlob


