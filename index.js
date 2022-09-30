const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const userRoutes = require('./controllers/user')

const app = express()

// Middleware
app.use(express.json())

// Routes
app.use('/user', userRoutes)

// db connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('DB connected'))
    .catch(err => console.error(err));

const PORT = 8080

app.listen(PORT, console.log(`listening on port ${PORT}`))
