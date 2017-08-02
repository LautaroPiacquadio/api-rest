'use strict'
let request = require('supertest-as-promised')
const _ = require('lodash')
const mongoose = require('mongoose')
const api = require('../app')
const config = require('../lib/config')
const host = api

request = request(host)

describe('Ruta de usuarios', function() {
    before(() => {
        mongoose.connect(config.db)
    })

    after((done) => {
        mongoose.disconnect(done)
        mongoose.models = {}
    })

    describe('POST /user', function() {
        it('deberia crear un user', function(done) {
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
                .end((err, res) => {
                    let body = res.body
                    expect(body).to.have.property('user')
                    user = body.user
                    expect(user).to.have.property('_id')
                    expect(user).to.have.property('username', 'lautaropiacquadio.lp@gmail.com')
                    done(err)
                })
        })
    })

    describe('GET /user', function() {
        it('deberia obtener todos los users', function(done) {
            let user_id, user2_id

            let user = {
                'username': 'lautaropiacquadio.lp@gmail.com',
                'password': 'Hola1234'
            }

            let user2 = {
                'username': 'laautaa_94@hotmail.com',
                'password': 'Hola1234'
            }

            request
                .post('/user')
                .set('Accept', 'application/json')
                .send(user)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            .then((res) => {
                user_id = res.body.user._id
                return request
                    .post('/user')
                    .set('Accept', 'application/json')
                    .send(user2)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                user2_id = res.body.user._id
                return request
                    .get('/user')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .expect('Content-Type', /application\/json/)
            }, done)
            .then((res) => {
                let body = res.body

                expect(body).to.have.property('users')
                expect(body.users).to.be.an('array').and.to.have.length.above(2)

                let users = body.users
                user = _.find(users, { _id: user_id })
                user2 = _.find(users, { _id: user2_id })

                expect(user).to.have.property('_id', user_id)
                expect(user).to.have.property('username', 'lautaropiacquadio.lp@gmail.com')

                expect(user2).to.have.property('_id', user2_id)
                expect(user2).to.have.property('username', 'laautaa_94@hotmail.com')

                done()
            }, done)
        })
    })

    describe('GET /user/:id', function() {
        it('deberia obtener un solo user', function(done) {
            let user_id
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
                user_id = res.body.user._id
                return request
                    .get('/user/' + user_id)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                let body = res.body
                expect(body).to.have.property('user')
                user = body.user
                expect(user).to.have.property('_id', user_id)
                expect(user).to.have.property('username', 'lautaropiacquadio.lp@gmail.com')
                done()
            }, done)
        })
    })

    describe('PUT /user/:id', function() {
        it('deberia modificar un user', function(done) {
            let user_id
            let user = {
                'username': 'lautaropiacquadio.lp@gmail.com',
                'password': 'Hola1234'
            }

            let new_user = {
                'username': 'lautaropiacquadio2@gmail.com'
            }

            request
                .post('/user')
                .set('Accept', 'application/json')
                .send(user)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            .then((res) => {
                user_id = res.body.user._id
                return request
                    .put('/user/' + user_id)
                    .set('Accept', 'application/json')
                    .send(new_user)
                    .expect(200)
                    .expect('Content-Type', /application\/json/)
            })
            .then((res) => {
                let body = res.body
                expect(body).to.have.property('user')
                user = body.user
                expect(user).to.have.property('_id', user_id)
                expect(user).to.have.property('username', 'lautaropiacquadio2@gmail.com')
                done()
            }, done)
        })
    })

    describe('DELETE /user/:id', function() {
        it('deberia eliminar un user', function(done) {
            let user_id
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
                user_id = res.body.user._id
                return request
                    .delete('/user/' + user_id)
                    .set('Accept', 'application/json')
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
