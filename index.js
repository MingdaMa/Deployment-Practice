require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

morgan.token('body', (req, res) => JSON.stringify(req.body))
const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())

app.get('/info', (req, res) => {
    const now = new Date()
    Person.find({}).then(result => {
        res.send(`<p>Phonebook has info for ${result.length} people</p> ${now}`)
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result)
    })
}) 

app.get('/api/persons/:id', (req, res, next) => { 
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (body.name === undefined || body.name === undefined) {
        return res.status(400).json({error: 'please type in name and number'})
    } 

    const newPerson = new Person({ 
        name: body.name,
        number: body.number
    }) 
    
    newPerson.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).sned({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).sned({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} `)
})