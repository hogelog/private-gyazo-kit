# Private Gyazo Kit
Private Gyazo Kit could build your only Gyazo [(http://gyazo.com/)](http://gyazo.com/)
Server and Clients.

## Run server
Private Gyazo server powered by node.js.

    $ git clone git://github.com/hogelog/private-gyazo-kit.git
    $ cd private-gyazo-kit
    $ npm install
    $ cp gyazo.conf.template gyazo.conf
    edit gyazo.conf...
    $ node gyazo.js

### Run server as daemon
    $ npm install forever -g
    $ forever start gyazo.js

## Build clients
Build Private Gyazo clients require only node.js!

    edit gyazo.conf...
    $ cd client
    $ node make.js
    Gyazo-for-Linux: ../public/gyazo
    Gyazowin: ../public/gyazowin.exe
    Gyazo: ../public/gyazomac.zip

## Distribute clients
Distribute above built clients.

    $ cp public/index.html.template public/index.html
    edit index.html...
