const EventEmitter = require('events').EventEmitter
const connect = require('./connect')
const manage = require('./manage')


/**
 * default options
 */
const defaultOpts = {
  setDNS: true,
  setSearch: true
}

/**
 * probe for openvpn binary executable
 */
function probeBinary() {
  return '/usr/local/sbin/openvpn'
}

/**
 * generate a temporary socket file
 */
function getSocketFile() {
  return '/tmp/moor.sock'
}

/**
 * generate a temporary opevpn pid file
 */
function getPidFile() {
  return '/tmp/moor.pid'
}

/**
 * Moor class
 */
class Moor extends EventEmitter {
  constructor(opts = defaultOpts) {
    super()
    this.opts = Object.assign(defaultOpts, opts)

    this.opts.binPath = probeBinary()
    this.opts.socketFile = getSocketFile()
    this.opts.pidFile = getPidFile()

    if (!this.opts.configDir) {
      throw new Error('Need configDir')
    }

    if (!this.opts.configFile) {
      throw new Error('Need configFile')
    }

    this.status = Moor.DISCONNECTED
    this.openvpn = null
    this.management = null
  }

  connect() {
    this.openvpn = connect(this.opts, (err, stdout, stderr) => {
      if (err) console.error(err)
      this.management = manage(this)
    })
  }

  disconnect() {
  }

  authenticate(username, password) {
    this.once('password:auth:success', () => {
      console.log('Authorized')
    })
    this.management.write(`username "Auth" ${username}\n`)
    this.management.write(`password "Auth" ${password}\n`)
  }
}

/**
 * status
 */
Moor.DISCONNECTED = 'DISCONNECTED'
Moor.CONNECTED = 'CONNECTED'
Moor.RECONNECTING = 'RECONNECTING'

module.exports = Moor