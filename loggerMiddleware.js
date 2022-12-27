const logger = (req, res, next) => {
  console.log(req.method)
  console.log(req.path)
  console.log(req.bady)
  console.log('------')
  next()
}
module.exports = logger
