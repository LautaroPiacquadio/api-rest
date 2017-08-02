'use strict'
const express = require('express')
const router = express.Router()
const _ = require('lodash')
const User = require('../lib/models/user')
const jwt = require('jsonwebtoken')
const config = require('../lib/config')
const crypto = require('crypto')
const algorithm = 'aes-256-ctr'

function encrypt(text) {
    let cipher = crypto.createCipher(algorithm, config.secret)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
}

function decrypt(text) {
    let decipher = crypto.createDecipher(algorithm, config.secret)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
}

router
.post('/', function(req, res, next) {
    console.log('POST: ', req.body)
    if(!req.body) {
        res.status(403).json({ error: true, message: 'Body empty' })
    }

    let _user = req.body
    User.findOne({ username: _user.username }, (err, user) => {
        if(err) {
            res.status(403).json({ error: true, message: err })
        } else if(user) {
            if(decrypt(user.password) === _user.password) {
                let token = jwt.sign(user, config.secret, {
                    expiresIn: '24hr'
                })

                res.status(201).json({ token: token })
            } else {
                res.status(403).json({ error: true, message: 'Wrong password or username' })
            }
        } else {
            res.status(403).json({ error: true, message: 'Unknown user' })
        }
    })
})

module.exports = router
