require('dotenv').config()
const express = require('express')
const cors = require('cors')
const dns = require('dns')
const shortId = require('shortid')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { urlModel } = require('./model')
const URL = require('url').URL

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
// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' })
})

app.post('/api/shorturl', function (req, res) {
  let hostname

  try {
    hostname = new URL(req.body.url).hostname
  } catch (e) {
    hostname = 'invalid url'
  }

  dns.lookup(hostname, async function (err) {
    if (err) {
      res.json({ error: hostname })
    } else {
      const posted_url = req.body.url
      // console.log(`Adding new entry for url: ${posted_url}`)
      const urlDoc = new urlModel({ original_url: posted_url })
      const { original_url, short_url } = await urlDoc.save()
      // console.log(`Added entry successfully for url: ${posted_url} with short_url: ${short_url}`)
      res.json({ original_url, short_url })
    }
  })
})

app.get('/api/shorturl/:short_url', async function (req, res) {
  const { original_url } = await urlModel.findOne({ short_url: req.params.short_url })
  if (original_url) {
    res.redirect(original_url)
  } else {
    res.json({ error: 'invalid url' })
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${ port }`)
})
