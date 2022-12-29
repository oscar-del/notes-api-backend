const mongoose = require('mongoose')
const connectionString = process.env.MONGO_DB_URI
mongoose.set('strictQuery', false)
mongoose.connect(connectionString)
  .then(() => {
    console.log('Databse connected')
  }).catch(err => {
    console.log(err)
  })

process.on('uncaughtException', () => {
  mongoose.connection.disconnect()
})
