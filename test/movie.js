'use strict'
let request = require('supertest-as-promised')
const _ = require('lodash')
const mongoose = require('mongoose')
const api = require('../app')
const config = require('../lib/config')
const host = api

request = request(host)

describe('Ruta de peliculas', function() {
    before(() => {
        mongoose.connect(config.db)
    })

    after((done) => {
        mongoose.disconnect(done)
        mongoose.models = {}
    })

    describe('POST /movie', function() {
        it('deberia crear una pelicula', function(done) {
            let movie = {
                'title': 'Harry Potter y la piedra filosofal',
                'year': 2001
            }

            let user = {
                'username': 'lautaropiacquadio.lp@gmail.com',
                'password': 'Hola1234'
            }

            request
                .post('/user')
                .set('Accept', 'application/json')
                .send(user)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            .then((res) => {
                let _user = res.body.user
                _user.password = user.password
                return request
                    .post('/auth')
                    .set('Accept', 'application/json')
                    .send(_user)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                let token = res.body.token
                return request
                    .post('/movie')
                    .set('Accept', 'application/json')
                    .set('x-access-token', token)
                    .send(movie)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                let body = res.body
                expect(body).to.have.property('movie')
                movie = body.movie
                expect(movie).to.have.property('title', 'Harry Potter y la piedra filosofal')
                expect(movie).to.have.property('year', 2001)
                expect(movie).to.have.property('_id')
                done()
            })
        })
    })

    describe('GET /movie', function() {
        it('deberia obtener todas las peliculas', function(done) {
            let movie_id, movie2_id, token

            let movie = {
                'title': 'Harry Potter y la piedra filosofal',
                'year': 2001
            }

            let movie2 = {
                'title': 'Harry Potter y la cámara secreta',
                'year': 2002
            }

            let user = {
                'username': 'lautaropiacquadio.lp@gmail.com',
                'password': 'Hola1234'
            }

            request
                .post('/user')
                .set('Accept', 'application/json')
                .send(user)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            .then((res) => {
                let _user = res.body.user
                _user.password = user.password
                return request
                    .post('/auth')
                    .set('Accept', 'application/json')
                    .send(_user)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                token = res.body.token
                return request
                    .post('/movie')
                    .set('Accept', 'application/json')
                    .set('x-access-token', token)
                    .send(movie)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                movie_id = res.body.movie._id
                return request
                    .post('/movie')
                    .set('Accept', 'application/json')
                    .set('x-access-token', token)
                    .send(movie2)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                movie2_id = res.body.movie._id
                return request
                    .get('/movie')
                    .set('Accept', 'application/json')
                    .set('x-access-token', token)
                    .expect(200)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                let body = res.body

                expect(body).to.have.property('movies')
                expect(body.movies).to.be.an('array').and.to.have.length.above(2)

                let movies = body.movies
                movie = _.find(movies, { _id: movie_id })
                movie2 = _.find(movies, { _id: movie2_id })

                expect(movie).to.have.property('_id', movie_id)
                expect(movie).to.have.property('title', 'Harry Potter y la piedra filosofal')
                expect(movie).to.have.property('year', 2001)

                expect(movie2).to.have.property('_id', movie2_id)
                expect(movie2).to.have.property('title', 'Harry Potter y la cámara secreta')
                expect(movie2).to.have.property('year', 2002)

                done()
            }, done)
        })
    })

    describe('GET /movie/:id', function() {
        it('deberia obtener una sola pelicula', function(done) {
            let movie_id, token
            let movie = {
                'title': 'Harry Potter y la piedra filosofal',
                'year': 2001
            }

            let user = {
                'username': 'lautaropiacquadio.lp@gmail.com',
                'password': 'Hola1234'
            }

            request
                .post('/user')
                .set('Accept', 'application/json')
                .send(user)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            .then((res) => {
                let _user = res.body.user
                _user.password = user.password
                return request
                    .post('/auth')
                    .set('Accept', 'application/json')
                    .send(_user)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                token = res.body.token
                return request
                    .post('/movie')
                    .set('Accept', 'application/json')
                    .set('x-access-token', token)
                    .send(movie)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                movie_id = res.body.movie._id
                return request
                    .get('/movie/' + movie_id)
                    .set('Accept', 'application/json')
                    .set('x-access-token', token)
                    .expect(200)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                let body = res.body
                expect(body).to.have.property('movie')
                movie = body.movie
                expect(movie).to.have.property('_id', movie_id)
                expect(movie).to.have.property('title', 'Harry Potter y la piedra filosofal')
                expect(movie).to.have.property('year', 2001)
                done()
            }, done)
        })
    })

    describe('PUT /movie/:id', function() {
        it('deberia modificar una pelicula', function(done) {
            let movie_id, token
            let movie = {
                'title': 'Harry Potter y la piedra filosofal',
                'year': 2001
            }

            let new_movie = {
                'title': 'Harry Potter y el prisionero de Azkaban',
                'year': 2004
            }

            let user = {
                'username': 'lautaropiacquadio.lp@gmail.com',
                'password': 'Hola1234'
            }

            request
                .post('/user')
                .set('Accept', 'application/json')
                .send(user)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            .then((res) => {
                let _user = res.body.user
                _user.password = user.password
                return request
                    .post('/auth')
                    .set('Accept', 'application/json')
                    .send(_user)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                token = res.body.token
                return request
                    .post('/movie')
                    .set('Accept', 'application/json')
                    .set('x-access-token', token)
                    .send(movie)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                movie_id = res.body.movie._id
                return request
                    .put('/movie/' + movie_id)
                    .set('Accept', 'application/json')
                    .set('x-access-token', token)
                    .send(new_movie)
                    .expect(200)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                let body = res.body
                expect(body).to.have.property('movie')
                movie = body.movie
                expect(movie).to.have.property('_id', movie_id)
                expect(movie).to.have.property('title', 'Harry Potter y el prisionero de Azkaban')
                expect(movie).to.have.property('year', 2004)
                done()
            }, done)
        })
    })

    describe('DELETE /movie/:id', function() {
        it('deberia eliminar una pelicula', function(done) {
            let movie_id, token
            let movie = {
                'title': 'Harry Potter y la piedra filosofal',
                'year': 2001
            }

            let user = {
                'username': 'lautaropiacquadio.lp@gmail.com',
                'password': 'Hola1234'
            }

            request
                .post('/user')
                .set('Accept', 'application/json')
                .send(user)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            .then((res) => {
                let _user = res.body.user
                _user.password = user.password
                return request
                    .post('/auth')
                    .set('Accept', 'application/json')
                    .send(_user)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                token = res.body.token
                return request
                    .post('/movie')
                    .set('Accept', 'application/json')
                    .set('x-access-token', token)
                    .send(movie)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                movie_id = res.body.movie._id
                return request
                    .delete('/movie/' + movie_id)
                    .set('Accept', 'application/json')
                    .set('x-access-token', token)
                    .expect(400)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                let body = res.body
                expect(body).to.be.empty
                done()
            }, done)
        })
    })
})
