const express = require('express')
const mongoose = require('mongoose')
const TextBlob = require('./models/Text')
const app = new express()

if (process.env.NODE_ENV === 'development') {
    mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true})
}

if (process.env.NODE_ENV === 'production') {
    mongoose.connect("mongodb+srv://typing_app_user1:YCeiNNbmePqJLjZz@typinggame.fxpm7.mongodb.net/test", {useNewUrlParser: true});
}


app.use(express.static('static'))

//Queries the database with a random id and responds with a text
app.get('/text', async(req, res) => {
    let textBlob = await TextBlob.findOne({"id" : 1});
    res.send(textBlob.text)
})

let port = process.env.PORT

if (port == null || port === ""){
    port = 4000
}

app.listen(port, ()=>{
    console.log('App listening on port 4000')
})
