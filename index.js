'use strict'

var superagent = require('superagent')

exports = module.exports = function (options) {
  if (!options) options = {}
  if (options instanceof superagent.Request) return attachVerboseErrors({}, options)
  return attachVerboseErrors.bind(null, options)
}

function attachVerboseErrors(options, req) {
  req.on('error', function (err) {
    if (!err.response || (options.filter && !options.filter(err.response))) return
    if (!err.response.get('Content-Type').startsWith('text/')) {
      err.message += '\n' + JSON.stringify(err.response.body, null, 2)
    } else {
      err.message += '\n' + err.response.text
    }
  })
}
