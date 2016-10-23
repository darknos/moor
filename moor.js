#!/usr/bin/env node

'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const exec = require('child_process').exec
const OTP = require('otp')
const program = require('commander')
const notifier = require('update-notifier')
const pkg = require('./package.json')
const version = pkg.version

// check for updates & notify
notifier({ pkg }).notify()

const homedir = os.homedir()
const configPath = path.join(homedir, '.moorrc')
let profiles

// TODO: platform check & early exit if not macOS

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


const VPNName = program.connect
if (typeof VPNName === 'boolean') {
  connectAll()
} else if (typeof VPNName === 'string') {
  const profile = profiles.find(profile => profile.name === VPNName)

  if (!profile) return exitWithError(`Failed to connect to ${VPNName}`)

  connect(profile)
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
  const updatePasswordCommand = `security add-generic-password -U -s Tunnelblick-Auth-${config.name} -a password -w ${generateOTP(config.secret)}`
  const connectCommand = `echo 'tell app "Tunnelblick" to connect "${config.name}"' | osascript`
  exec(updatePasswordCommand, (err, stdout, stderr) => {
    if (err) return exitWithError(err)
    exec(connectCommand, (err, stdout, stderr) => {
      if (err) return exitWithError(err)
    })
  })
}

function disconnect(config) {
  const disconnectCommand = `echo 'tell app "Tunnelblick" to disconnect "${config.name}"' | osascript`
  exec(disconnectCommand, (err, stadout, stderr) => {
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
