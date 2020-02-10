const mongoose = require('mongoose')

var process

if (process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

var A = []

process.argv.forEach((val) => {
  //  console.log(`${index}: ${val}`);
  A.push(val)
})

if (A.length < 4) {

  console.log('phonebook: ')

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
} else {

  const person = new Person({
    name: A[3],
    number: A[4],
  })

  person.save().then(
    console.log('added ' + A[3] + ' number ' + A[4] + ' to phonebook'),
    mongoose.connection.close()
  )
}