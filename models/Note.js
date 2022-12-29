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

// Ejemplo de como inyectar datos en mongo
/* const note = new Note({
  content: 'Nota desde MongoDB',
  date: new Date(),
  important: true
})

note.save()
  .then(result => {
    console.log(result)
    mongoose.connection.close()
  })
  .catch(err => {
    console.log(err)
  })
 */
