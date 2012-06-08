# Private Gyazo Kit
Private Gyazo Kit could build your only Gyazo [(http://gyazo.com/)](http://gyazo.com/)
Server and Clients.

## Run server
Private Gyazo server powered by node.js.

    $ npm install
    $ cp gyazo.conf.template gyazo.conf
    edit gyazo.conf...
    $ node gyazo.js

## Build clients
Build Private Gyazo clients.

    edit gyazo.conf...
    $ node configure.js
    build some clients...

## Distribute clients
Distribute above built clients.

    copy built clients to public/
    $ cp public/index.html.template public/index.html
    edit index.html...
