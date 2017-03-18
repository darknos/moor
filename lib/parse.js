function parse(emitter, text, opts = {}) {
  console.log(text)
  if (opts.raw) {
    emitter.emit('raw', text)
    return
  }

  if (text.indexOf(`PASSWORD:Need 'Auth' username/password`) !== -1) {
    emitter.emit('password:auth')
    return
    // client.write(`username "Auth" ${username}\n`)
    // client.write(`password "Auth" ${password()}\n`)
  }

  if (text.indexOf(`PASSWORD:Need 'Private Key' password`) !== -1) {
    emitter.emit('password:private-key')
    return
  }

  if (text.indexOf(`SUCCESS: 'Auth' password entered, but not yet verified`) !== -1) {
    emitter.emit('password:auth:success')
    return
  }

}

module.exports = parse