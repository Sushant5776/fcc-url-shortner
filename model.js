const { model, Schema } = require('mongoose')

const urlSchema = new Schema({
  original_url: { type: String, rquired: true, trim: true },
  short_url: String
})

module.exports.urlModel = model('URLModel', urlSchema)