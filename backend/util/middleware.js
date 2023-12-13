const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    // if (error.name === 'CastError') {
    //   return response.status(400).send({ error: 'malformatted id' })
    // } 
  
    next(error)
}
  

module.exports = { requestLogger, unknownEndpoint, errorHandler }