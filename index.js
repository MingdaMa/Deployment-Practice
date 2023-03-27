const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

let persons = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
      },
      { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
      },
      { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
      },
      { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
      }
]

app.use(express.json())

app.get('/api/persons', (req, res) => {
    res.json(persons)
}) 

app.get('/api/persons/:id', (req, res) => {
    const personId  = Number(req.params.id)
    const person = persons.find(person => person.id === personId)

    if (!person) {
        res.status(404).json({error: 'Person does not exist'})
    } else {
        res.json(person)
    }
})

app.get('/info', (req, res) => {
    const numOfPersons = persons.length
    const now = new Date()
    res.send(`<p>Phonebook has info for ${numOfPersons} people</p> ${now}`)
})

const generateId = () => {
    return Math.random(1000000000)
}

app.post('/api/persons', (req, res) => {
    const body = req.body;
    console.log(body)

    if (!body.name || !body.name) {
        res.status(400).json({error: 'please type in name and number'})
    } 
    const isUnique = persons.find(person => person.name === body.name) ? false : true
    if (!isUnique) {
        res.status(400).json({error: 'name must be unique'})
    }
    const newPerson = { 
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons.concat(newPerson)

    res.json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
    const deleteId = Number(req.params.id)
    const newPersons = persons.filter(person => person.id !== deleteId)
    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} `)
})