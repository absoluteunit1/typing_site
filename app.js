const express = require('express')
const mongoose = require('mongoose')
const TextBlob = require('./models/Text')
const app = new express()


mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true})


app.use(express.static('static'))

//Queries the database with a random id and responds with a text
app.get('/text', async(req, res) => {
    let id = Math.floor(Math.random()*Math.floor(2)) + 1; 
    let textBlob = await TextBlob.findOne({"_id" : `${id}`});
    res.send(textBlob.text)
})

let port = process.env.PORT

if (port == null || port == ""){
    port = 4000
}

app.listen(port, ()=>{
    console.log('App listening on port 4000')
})
