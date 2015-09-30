// TODO check for package.json
// TODO load a local file?

'use strict'

var glob = require('glob')
  .sync
var path = require('path')
var fs = require('fs')

var nconf = require('nconf')
nconf.argv()
  .env()

var configRoot = nconf.get('HOME') + '/etc/systems/'

var environment = nconf.get('NODE_ENV').toLowerCase()
if (!environment) {
  throw new Error('NODE_ENV not set')
}

var appDefaultConfigs = _loadFiles(glob(configRoot + '*.default.json'))
var appConfigs = _loadFiles(glob(configRoot + '*.' + environment + '*.json'))

nconf.add('app-configs', {
  'type': 'literal',
  'store': appConfigs,
})
nconf.add('app-defaults-configs', {
  'type': 'literal',
  'store': appDefaultConfigs,
})

module.exports = nconf

function _loadFiles(files) {
  var config = {}

  files.forEach(function (file) {
    var postfix = new RegExp('\.(' + environment + '|default)\.json')
    var app = path.basename(file)
      .replace(postfix, '')
    config[app] = JSON.parse(fs.readFileSync(file))
  })

  return config
}
