const mongoose = require('mongoose')


const TextBlob = require('./models/Text')

mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true});

let id = Math.floor(Math.random()*Math.floor(3)) + 1; 
console.log(id);
async function getText() {
    const textBlob = await TextBlob.findOne({"id" : `${id}`});
    console.log(textBlob);
    console.log(typeof(textBlob));
    console.log(textBlob.text);
}
getText();
