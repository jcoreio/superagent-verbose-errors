// @flow

'use strict'

const expect = require('chai').expect
const superagent = require('superagent')
const use = require('superagent-use')
const verboseErrors = require('..')
const express = require('express')
const bodyParser = require('body-parser')

const port = 3456
const url = 'http://localhost:' + port

describe('superagent-verbose-errors', () => {
  let server
  before((done) => {
    const app = express()
    app.get('/', bodyParser.json(), (req, res) => {
      const code = req.body.code
      const response = req.body.response
      res.type(response instanceof Object ? 'application/json' : 'text/plain').status(code).send(response)
    })
    server = app.listen(port, done)
  })
  after(() => {
    if (server) server.close()
  })

  describe('used directly', () => {
    const request = use(superagent)
    request.use(verboseErrors)
    it('includes text error response', (done) => {
      request.get(url).type('json').send({code: 400, response: 'TEST'}).then(
        () => done.fail('expected an error!'),
        (err) => {
          expect(err.message).to.match(/Bad Request\nTEST/)
          done()
        }
      )
    })
    it('includes json error response', (done) => {
      request.get(url).type('json').send({code: 400, response: {foo: 'bar'}}).then(
        () => done.fail('expected an error!'),
        (err) => {
          expect(err.message).to.match(/Bad Request\n{\n {2}"foo": "bar"\n}/)
          done()
        }
      )
    })
  })
  describe('without options', () => {
    const request = use(superagent)
    request.use(verboseErrors())
    it('includes text error response', (done) => {
      request.get(url).type('json').send({code: 400, response: 'TEST'}).then(
        () => done.fail('expected an error!'),
        (err) => {
          expect(err.message).to.match(/Bad Request\nTEST/)
          done()
        }
      )
    })
    it('includes json error response', (done) => {
      request.get(url).type('json').send({code: 400, response: {foo: 'bar'}}).then(
        () => done.fail('expected an error!'),
        (err) => {
          expect(err.message).to.match(/Bad Request\n{\n {2}"foo": "bar"\n}/)
          done()
        }
      )
    })
  })
  describe('with filter', () => {
    const request = use(superagent)
    request.use(verboseErrors({
      filter: response => response.status >= 400 && response.status < 500
    }))
    it('includes responses matching the filter', (done) => {
      request.get(url).type('json').send({code: 404, response: 'TEST'}).then(
        () => done.fail('expected an error!'),
        (err) => {
          expect(err.message).to.match(/Not Found\nTEST/)
          done()
        }
      )
    })
    it('excludes responses not matching the filter', (done) => {
      request.get('http://localhost:3456/').type('json').send({code: 500, response: 'TEST'}).then(
        () => done.fail('expected an error!'),
        (err) => {
          expect(err.message).to.match(/Internal Server Error/)
          done()
        }
      )
    })
  })
})
