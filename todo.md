# ToDos

## Core
Moor core issues commands & responds to openvpn's events.

### Responsibilities

1. Parse & set DNS and search addresses from logs from `PUSH` command
2. Launch `openvpn` process with management interface
3. Manage Unix domain socket of management interface
4. Handle connection, disconnection & reconnection


## Config
The `~/.moor` directory needs to be managed. This directory will have copied configuration files and any other moor related config. We'll be targeting only 2FA profiles for this version.

### Responsibilities

1. Add profile
2. Remove profile
3. Configure secret for 2fa profile types

## Parser
Parses & interprets messages from openvpn management protocol.

### Responsibilities

1. _TODO_


# Usage example

```js
var moor = new Moor({
  binPath: '/path/to/openvpn/binary',
  configDir: '/path/to/config/dir',
  configFile: '/path/to/ovpn/config',
  setDNS: true,                               // set DNS from log output
  setSearch: true                             // set search from log output
})

moor.on('connect', () => {
  // connected
})

moor.on('disconnect', () => {
  // disconnected
})

moor.on('reconnecting', () => {
  // reconnection initiated
})

moor.on('auth', () => {
  // need auth
})

moor.on('auth:success', () => {
  // auth success
})

moor.on('auth:failed', () => {
  // auth failed
})

moor.on('bytes', () => {
  // how many bytes transferred in session
})

// APIs
// connect to openvpn server
moor.connect()

// fetch amount of data transferred
moor.bytes()

// disconnect from openvpn server by sending SIGTERM
moor.disconnect()

// restarts the openvpn process by sending SIGUSR1
moor.restart()
```

### Things to figure out

[ ] `openvpn` needs root privileges. How do we handle that?
[ ] Listen for `FATAL` responses from openvpn and handle them
[ ] Instead of using `networksetup` use `scutil`
[ ] On SIGTERM, kill the openvpn process
[ ] Use `--writepid` option of openvpn
[ ] Handle condition if config file does not exist or incorrect
[ ] If management client disconnects, attempt to connect again