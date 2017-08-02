'use strict'
const jwt = require('jsonwebtoken')
const config = require('../config')

const auth = (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token']
    if(token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if(err) {
                res.status(403).json({ error: true, message: err })
            } else {
                req.decoded = decoded
                next()
            }
        })
    } else {
        res.status(403).json({ error: true, message: 'Unexpected token' })
    }
}

module.exports = auth
