# superagent-verbose-errors

[![Build Status](https://travis-ci.org/jcoreio/superagent-verbose-errors.svg?branch=master)](https://travis-ci.org/jcoreio/superagent-verbose-errors)
[![Coverage Status](https://codecov.io/gh/jcoreio/superagent-verbose-errors/branch/master/graph/badge.svg)](https://codecov.io/gh/jcoreio/superagent-verbose-errors)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

include response body in superagent errors for failed requests

## Usage

```sh
npm install --save superagent superagent-use superagent-verbose-errors
```

To make any superagent request that fails append the response body to
its error message:
```js
const superagent = require('superagent-use')(require('superagent'))
superagent.use(require('superagent-verbose-errors'))
```


To only include the response body for certain errors:
```js
const superagent = require('superagent-use')(require('superagent'))
superagent.use(require('superagent-verbose-errors')({
  filter: res => res.status === 400
}))
```
