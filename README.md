[![Join the chat at https://gitter.im/moor-vpn/Lobby](https://badges.gitter.im/moor-vpn/Lobby.svg)](https://gitter.im/moor-vpn/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> ## :tada: A new update is on the horizon
> A new version is in the works
> * it'll stop depending on Tunnelblick & depend on OpenVPN directly
> * would auto reconnect on disconnection
> * stability

## Overview
Moor is a simple CLI app to easily manage connections to an OpenVPN server. If you are having a hard time using [Tunnelblick](https://tunnelblick.net/) along with a 2FA solution like [Google Authenticator](https://en.wikipedia.org/wiki/Google_Authenticator), then *moor* may feel like fresh clean air.

## Requirements

1. Assumes [Tunnelblick](https://tunnelblick.net/) macOS app to be installed.
2. Assumes a VPN profile is correctly configured in Tunnelblick
3. Assumes your VPN account password to be Authenticator [TOTP](https://tools.ietf.org/html/rfc6238)
4. [node.js](https://nodejs.org/en/) needs to be installed, of course

## Installation

```
$ npm install -g moor
```

This should put `moor` in your bin path.

## Configuration

Moor expects a `~/.moorrc` JSON file, that should look like

```json
[
  {
    "name": "<tunnelblick-profile-name>",
    "username": "<username>",
    "pin": "<pin code, to be prepend a google auth code>",
    "secret": "<hussssshhhhhhhhhh>"
  }
]
```

`name` is the Tunnelblick profile name as it is. `secret` is the secret provided by the VPN server

## Questions

Things are still quite rough around the edges. Feel free to file issues/comments.
[GitHub Issues](https://github.com/detj/moor/issues/new)

## License
  [MIT](LICENSE)
