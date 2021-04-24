const mongoose = require('mongoose');




const TextBlob = require('./models/Text')

mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true});


async function getText() {
    const textBlob = await TextBlob.findOne({"_id" : `${1}`});
    console.log(textBlob);
}
getText();
