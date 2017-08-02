'use strict'
const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Movie = require('../lib/models/movie')

router
.post('/', function(req, res, next) {
    console.log('POST: ', req.body)
    if (!req.body) {
        res.status(403).json({ error: true, message: 'Body empty' })
    }

    let _movie = req.body
    Movie.findOne(_movie, (err, movie) => {
        if(err) {
            res.status(403).json({ error: true, message: err })
        } else if(movie) {
            res.status(201).json({ movie: movie })
        } else {
            new Movie({
                title: _movie.title,
                year: _movie.year
            })
            .save((err, movie) => {
                if(err) {
                    res.status(403).json({ error: true, message: err })
                }
                res.status(201).json({ movie: movie })
            })
        }
    })
})

.get('/', function(req, res, next) {
    console.log('GET: ', req.body)

    Movie.find({}, (err, movies) => {
        if(err) {
            res.status(403).json({ error: true, message: err })
        }
        res.status(200).json({ movies: movies })
    })
})

.get('/:id', function(req, res, next) {
    console.log('GET: ', req.params.id)
    if (!req.params.id) {
        res.status(403).json({ error: true, message: 'Params empty' })
    }

    Movie.findOne({ _id: req.params.id }, (err, movie) => {
        if(err) {
            res.status(403).json({ error: true, message: err })
        }
        res.status(200).json({ movie: movie })
    })
})

.put('/:id', function(req, res, next) {
    console.log('PUT: ', req.params.id, req.body)
    if (!req.params.id || !req.body) {
        res.status(403).json({ error: true, message: 'Params or body empty' })
    }

    Movie.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, movie) => {
        if(err) {
            res.status(403).json({ error: true, message: err })
        }
        res.status(200).json({ movie: movie })
    })
})

.delete('/:id', function(req, res, next) {
    console.log('DELETE: ', req.params.id)
    if (!req.params.id) {
        res.status(403).json({ error: true, message: 'Params empty' })
    }

    Movie.findByIdAndRemove(req.params.id, (err, movie) => {
        if(err) {
            res.status(403).json({ error: true, message: err })
        }
        res.status(400).json({})
    })
})

module.exports = router
