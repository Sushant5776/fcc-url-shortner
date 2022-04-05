const {model, Schema} = require('mongoose')
const shortId = require('shortid')

const urlSchema = new Schema({
  original_url: {type: String, rquired: true, trim: true},
  short_url: {type: String, default: shortId.generate()}
})

module.exports.urlModel = model('URLModel', urlSchema)