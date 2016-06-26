# CPass UI

This is a desktop app made with electron and React.js that is designed
as a simple UI wrapper that talks to a local server/API/daemon
`cryptagd` which is provided by
[CrypTag](https://github.com/elimisteve/cryptag).

If you're not using [CrypTag](https://github.com/elimisteve/cryptag) to manage your passwords, you
should be. Go install it. It's awesome.

## Pre-requisites

### cpass-sandstorm

Make sure you have Go installed, then run:

    $ go get github.com/elimisteve/cryptag/cmd/cpass-sandstorm
    $ cpass-sandstorm init <sandstorm_webkey>

To generate a Sandstorm webkey, [install this](https://apps.sandstorm.io/app/mkq3a9jyu6tqvzf7ayqwg620q95p438ajs02j0yx50w2aav4zra0)
then _click the key icon_ near the top of your screen.

If someone else gave you the Sandstorm webkey along with the decrypt
key needed to access the passwords s/he is sharing with you, also run

    $ cpass-sandstorm setkey <key>

### cryptagd

Install the local daemon `cryptagd` that CPass UI talks to:

    $ go get github.com/elimisteve/cryptag/servers/cryptagd

Run it in one terminal with

    $ cryptagd

meanwhile, in another terminal, run CPass UI (see next section).

## Installation and Running

``` $ npm install ```

then

``` $ npm start ```
