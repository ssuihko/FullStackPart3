const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

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
  res.json(persons)
})

 app.get('/info', (req, res) => {
    res.send('<p>Phonebook has info for ' + length + ' people ' + '<br>' + new Date() + ' </p>')
 })

 app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    length = persons.length.toString()
  
    response.status(204).end()
  })

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person) { 
        res.json(person)
    } else {
        res.status(404).end()}
})

 app.post('/api/persons', (request, response) => {

   let nameArray = persons.map(({name}) => name)

   const body = request.body

   if (!body.name || !body.number ) {
       return response.status(400).json({ 
         error: 'content missing' 
       })
     }

   const person = {
     name: body.name,
     number: body.number,
     id: Math.floor(Math.random() * Math.floor(1000)),
     
   }

   

   if(nameArray.indexOf(person.name) > -1) {
      return response.status(400).json({ 
         error: 'name must be unique' 
       })
   } 

   app.use(morgan(function ( tokens, req, res) {
     return
   }))
 
   persons = persons.concat(person)
   nameArray = nameArray.concat(person.name)
 
   length = persons.length.toString()
 
   response.json(person)
 })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
