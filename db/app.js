
const express = require('express')
const { getTopicsController } = require('./controller/controller.js')
const { handle404 } = require('./errorHandlers/errorHandlers.js')


const app = express()

app.use(express.json())

app.get('/api/topics', getTopicsController)

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send('server error!')    
})


module.exports = app
