const spawn = require('child_process').spawn
const execFile = require('child_process').execFile

const bin = 'sudo'

const opts = {}

module.exports = function(opts, cb) {
  const args = [
    opts.binPath,
    `--cd`,
    opts.configDir,
    `--config`,
    opts.configFile,
    `--management`,
    opts.socketFile,
    `unix`,
    `--management-up-down`,
    `--management-query-passwords`,
    `--writepid`,
    opts.pidFile,
    `--daemon`
  ]

  return execFile(bin, args, opts, cb)
}