const express = require('express')
const cors = require('cors')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const config = require('./lib/config')

const app = express()

// mongoose.createConnection(config.db)
mongoose.connect(config.db)

const auth_middle = require('./lib/middleware/auth')
const index = require('./routes/index')
const auth = require('./routes/auth')
const user = require('./routes/user')
const movie = require('./routes/movie')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors({ origin: 'http://localhost:8080' }))

// Rutas inseguras
app.use('/', index)
app.use('/auth', auth)
app.use('/user', user)

// Middleware
app.use(auth_middle)

// Rutas seguras
app.use('/movie', movie)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(err.status || 500)
})

module.exports = app
