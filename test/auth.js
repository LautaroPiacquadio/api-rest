'use strict'
let request = require('supertest-as-promised')
const _ = require('lodash')
const mongoose = require('mongoose')
const api = require('../app')
const config = require('../lib/config')
const host = api

request = request(host)

describe('Ruta de auth', function() {
    before(() => {
        mongoose.connect(config.db)
    })

    after((done) => {
        mongoose.disconnect(done)
        mongoose.models = {}
    })

    describe('POST /auth', function() {
        it('deberia autenticar un user', function(done) {
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
                    return request
                        .post('/auth')
                        .set('Accept', 'application/json')
                        .send(user)
                        .expect(201)
                        .expect('Content-Type', /application\/json/)
                })
                .then((res) => {
                    let body = res.body

                    expect(body).to.have.property('token')
                    done()
                }, done)
        })
    })
})
