var express = require('express')
var cors = require('cors')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var mongoose = require('mongoose')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var config = require('./lib/config')

var app = express()

// mongoose.createConnection(config.db)
mongoose.connect(config.db)

var auth_middle = require('./lib/middleware/auth')
var index = require('./routes/index')
var auth = require('./routes/auth')
var user = require('./routes/user')
var movie = require('./routes/movie')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
// app.use(cors({ origin: http://localhost:8000 }))

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
    var err = new Error('Not Found')
    err.status = 404
    next(err)
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(err.status || 500)
});

module.exports = app
