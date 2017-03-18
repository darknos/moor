const net = require('net')
const parse = require('./parse')

// function parse(text) {
//   if (text.indexOf(`PASSWORD:Need 'Auth' username/password`) !== -1) {
//     console.log(`supplying password ${password()}`)
//     client.write(`username "Auth" ${username}\n`)
//     client.write(`password "Auth" ${password()}\n`)
//   }
// }

function manage(moor) {
  const socket = new net.Socket()
  const SOCKET_FILE = moor.opts.socketFile

  socket.on('error', e => {
    if (e.code === 'ENOENT') {
      console.error('openvpn server is not running or not running with --management')
    } else {
      console.error(e)
    }
  })

  const client = socket.connect({ path: SOCKET_FILE }, () => {
    console.log(`connected to ${SOCKET_FILE}`)
  })

  client.on('error', err => {
    console.error(err)
  })

  client.on('data', (data) => {
    parse(moor, data.toString())
  })

  return client

}

module.exports = manage