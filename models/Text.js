const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TextSchema = new Schema({
    id: Number,
    text: String
});

const TextBlob = mongoose.model('TextBlob', TextSchema);
module.exports = TextBlob


