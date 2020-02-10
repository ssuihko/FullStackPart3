require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name ===  'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

// const Person = mongoose.model('Person', personSchema)
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(bodyParser.json())
// app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    {  
        name: "Arto Hellas",
        number: "040-123456",
        id: 1

     }, {
        name: "Ada Lovelace",
        number: "39-44-534356767",
        id: 4
     },
     {
        name: "Dan Abramov",
        number: "12-43-234567",
        id: 3
     }, 
     {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 2
     }

]

var length = persons.length.toString()

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  });
});

 app.get('/info', (req, res) => {
    res.send('<p>Phonebook has info for ' + length + ' people ' + '<br>' + new Date() + ' </p>')
 })

 app.delete('/api/persons/:id', (request, response) => {
   Person.findByIdAndRemove(request.params.id)
   .then(result => {
     response.status(204).end()
   })
   .catch(error => next(error))
    // const id = Number(request.params.id)
    // persons = persons.filter(person => person.id !== id)

    // length = persons.length.toString()
  
    // response.status(204).end()
  })

app.get('/api/persons/:id', (req, res, next) => {

  Person.findById(req.params.id)
  .then(person => {
    if(person) {
      res.json(person.toJSON())
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error)) 

})

app.put('api/persons/:id', (req, res, next) => {
  
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: number })
  .then(updatedPerson => {
    res.json(updatedPerson.toJSON())
  })
  .catch(error => next(error))

})

 app.post('/api/persons', (request, response) => {

   let nameArray = persons.map(({name}) => name)

   const body = request.body

   if (!body.name || !body.number ) {
       return response.status(400).json({ 
         error: 'content missing' 
       })
     }

   const person = new Person({
     name: body.name,
     number: body.number,
     id: Math.floor(Math.random() * Math.floor(1000)),
     
   })

   
   if(nameArray.indexOf(person.name) > -1) {
    
      return response.status(400).json({ 
         error: 'name must be unique, do you want to replace the number recorded to this name' 
       })
   } 

   app.use(morgan(function ( tokens, req, res) {
     return
   }))
 
   persons = persons.concat(person)
   nameArray = nameArray.concat(person.name)
 
   length = persons.length.toString()
 
   person.save().then(savedPerson => {
     response.json(savedPerson.toJSON())
   })
   
 })

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
