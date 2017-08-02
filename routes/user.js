'use strict'
const express = require('express')
const router = express.Router()
const _ = require('lodash')
const User = require('../lib/models/user')
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
                res.status(201).json({ user: { _id: user._id, username: user.username } })
            } else {
                res.status(201).json({ error: true, message: 'User exists' })
            }
        } else {
            new User({
                username: _user.username,
                password: encrypt(_user.password)
            })
            .save((err, user) => {
                if(err) {
                    res.status(403).json({ error: true, message: err })
                }
                res.status(201).json({ user: { _id: user._id, username: user.username } })
            })
        }
    })
})

.get('/', function(req, res, next) {
    console.log('GET: ', req.body)

    User.find({}, (err, users) => {
        if(err) {
            res.status(403).json({ error: true, message: err })
        }
        res.status(200).json({ users: users })
    })
})

.get('/:id', function(req, res, next) {
    console.log('GET: ', req.params.id)
    if(!req.params.id) {
        res.status(403).json({ error: true, message: 'Params empty' })
    }

    User.findOne({ _id: req.params.id }, (err, user) => {
        if(err) {
            res.status(403).json({ error: true, message: err })
        }
        res.status(200).json({ user: user })
    })
})

.put('/:id', function(req, res, next) {
    console.log('PUT: ', req.params.id, req.body)
    if(!req.params.id || !req.body) {
        res.status(403).json({ error: true, message: 'Params or body empty' })
    }

    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
        if(err) {
            res.status(403).json({ error: true, message: err })
        }
        res.status(200).json({ user: user })
    })
})

.delete('/:id', function(req, res, next) {
    console.log('DELETE: ', req.params.id)
    if(!req.params.id) {
        res.status(403).json({ error: true, message: 'Params empty' })
    }

    User.findByIdAndRemove(req.params.id, (err, user) => {
        if(err) {
            res.status(403).json({ error: true, message: err })
        }
        res.status(400).json({})
    })
})

module.exports = router
