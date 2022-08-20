const express = require('express')
const app = express()
const port = 3000

const mongooose = require('mongoose')

const MONGO_USER = 'user'
const MONGO_PASSWORD = 'password'
const MONGO_HOST = 'mongo-container'
const MONGO_PORT = '27017'
const MONGO_DB = 'mydb'

const mongoURI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

mongooose.connect(mongoURI, { useNewUrlParser: true })

const Animal = mongooose.model('Animal', {
  name: String,
  age: Number,
  type: String
})

app.get('/find-all',
  async (req, res) => {
    const animals = await Animal.find()
    console.log('Listing data')
    res.send(animals)
  }
)

app.get('/create',
  async (req, res) => {
    await Animal.create({
      name: 'Lion',
      age: 10,
      type: 'Mammal'
    }).then(() => {
      console.log('Animal created')
      res.send('Animal created')
    })
  }
)

app.listen(port, () => console.log(`App listening on port ${port}!`))

