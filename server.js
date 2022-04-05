require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { urlModel } = require('./model')
const shortId = require('shortid')

const app = express()

// Connecting to Database
mongoose.connect(process.env[ 'MONGO_URI' ], { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
  if (err) return console.log(err)
  console.log('Database Connected')
})

// Basic Configuration
const port = process.env.PORT || 3000

app.use(cors())

app.use('/public', express.static(`${ process.cwd() }/public`))

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' })
})

app.post('/api/shorturl', async function (req, res) {
  const httpRegex = /^(http|https)(:\/\/)/
  const url = httpRegex.test(req.body.url)
  if (url) {
    const urlDoc = new urlModel({ original_url: req.body.url, short_url: shortId.generate() })
    const { original_url, short_url } = await urlDoc.save()
    res.json({ original_url, short_url })
  } else {
    res.json({ error: 'invalid url' })
  }
})

app.get('/api/shorturl/:short_url', async function (req, res) {
  const response = await urlModel.findOne({ short_url: req.params.short_url })
  if (response) {
    return res.redirect(response.original_url)
  } else {
    res.json({ error: 'invalid url' })
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${ port }`)
})
