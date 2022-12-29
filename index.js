require('dotenv').config()
require('./mongo') // Conexion con mongo

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const express = require('express')
const logger = require('./loggerMiddleware')
const cors = require('cors')
const Note = require('./models/Note')
const notFount = require('./middleware/notFount')
const handleErros = require('./middleware/handleErros')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/img', express.static('img'))
app.use(logger)

Sentry.init({
  dsn: 'https://3f203376090b4aae98b26f12114bd74f@o4504414732615680.ingest.sentry.io/4504414738579456',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app })
  ],
  tracesSampleRate: 1.0
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id).then(note => {
    if (note) {
      return res.json(note)
    } else {
      res.status(404).end()
    }
  }).catch(next)
})

app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findOneAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      res.json(result)
    })
})

app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  Note.findOneAndRemove(id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

app.post('/api/notes/', (req, res) => {
  const note = req.body

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    important: note.important || false,
    date: new Date()
  })

  newNote.save().then(savedNote => {
    res.json(savedNote)
  })
})

app.use(notFount)

app.use(Sentry.Handlers.errorHandler())

app.use(handleErros)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server run on port ${PORT}`)
})
