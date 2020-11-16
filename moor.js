#!/usr/bin/env node

'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const exec = require('child_process').exec
const OTP = require('otp')
const mkdirp = require('mkdirp')
const program = require('commander')
const notifier = require('update-notifier')
const pkg = require('./package.json')
const version = pkg.version

// check for updates & notify
notifier({ pkg }).notify()

const homedir = os.homedir()
const configPath = path.join(homedir, '.moorrc')
const tunnelblickConfigPath = path.join(homedir, 'Library/Application Support/Tunnelblick/Configurations')
let profiles

// platform check & early exit if not macOS
if (os.platform() !== 'darwin') {
  exitWithError('Only OS X/macOS supported')
}

// make sure Tunnelblick config path exists
mkdirp(tunnelblickConfigPath)

// read config file
try {
  profiles = JSON.parse(fs.readFileSync(configPath))
} catch(e) {
  exitWithError(`Error reading config file ${configPath}`)
}

program
  .version(version)
  .option('-c, --connect [name]', 'connect to VPN, connects to all if name not mentioned')
  .option('-d, --disconnect [name]', 'disconnect from VPN, disconnects from all if name not mentioned')
  .parse(process.argv)

// show default help if nothing gets passed
if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0)
}

if (program.connect && program.disconnect) {
  exitWithError('Cannot connect & disconnect at the same time')
}

// VPN profile name to connect
const connectName = program.connect
const connectNameType = typeof connectName

// VPN profile name to disconnect
const disconnectName = program.disconnect
const disconnectNameType = typeof disconnectName

// connection
if (connectNameType === 'boolean') {
  connectAll()
} else if (connectNameType === 'string') {
  const profile = profiles.find(profile => profile.name === connectName)

  if (!profile) return exitWithError(`Failed connecting to ${connectName}`)

  connect(profile)
}

// disconnection
if (disconnectNameType === 'boolean') {
  disconnectAll()
} else if (disconnectNameType === 'string') {
  const profile = profiles.find(profile => profile.name === disconnectName)

  if (!profile) return exitWithError(`Failed disconnecting from ${disconnectName}`)

  disconnect(profile)
}

function exitWithError(err) {
  if (err instanceof Error) {
    throw err
  } else if (typeof err === 'string') {
    console.log(err)
  }

  process.exit(1)
}

function connect(config) {
  writePass(config.name, config.username, config.pin+generateOTP(config.secret))
  const connectCommand = `echo 'tell app "Tunnelblick" to connect "${config.name}"' | osascript`
  exec(connectCommand, (err, stdout, stderr) => {
    if (err) return exitWithError(err)
  })
}

function disconnect(config) {
  const disconnectCommand = `echo 'tell app "Tunnelblick" to disconnect "${config.name}"' | osascript`
  exec(disconnectCommand, (err, stdout, stderr) => {
    if (err) return exitWithError(err)
  })
}

function connectAll() {
  profiles.forEach(connect)
}

function disconnectAll() {
  profiles.forEach(disconnect)
}

function generateOTP(secret) {
  const otp = OTP({ secret })
  return otp.totp()
}


/**
 * writePass - update password in Tunnelblick config
 */
function writePass(name, username, pass) {
  const prefixPath = `${name}.tblk/Contents/Resources`
  const ovpnPath = path.join(tunnelblickConfigPath, prefixPath, 'config.ovpn')
  const authFile = path.join(tunnelblickConfigPath, prefixPath, 'auth.txt')
  let ovpnData = fs.readFileSync(ovpnPath, { encoding: 'utf8' })

  fs.writeFileSync(authFile, `${username}\n${pass}`)

  if (ovpnData.indexOf('auth-user-pass auth.txt') < 0) {
    ovpnData = ovpnData.replace('auth-user-pass', 'auth-user-pass auth.txt')
    fs.writeFileSync(ovpnPath, ovpnData)
  }

}
