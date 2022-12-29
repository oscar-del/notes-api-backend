const { model, Schema } = require('mongoose')
const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returndObject) => {
    returndObject.id = returndObject._id
    delete returndObject._id
    delete returndObject.__v
  }
})

const Note = model('Note', noteSchema)

module.exports = Note
