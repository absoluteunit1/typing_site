const express = require('express')

const app = new express()

app.use(express.static('static'))

app.get('/text', function (req, res) {
    let temp = "This is a sample text"
    res.send(temp)
})

let port = process.env.PORT

if (port == null || port == ""){
    port = 4000
}

app.listen(port, ()=>{
    console.log('App listening on port 4000')
})
