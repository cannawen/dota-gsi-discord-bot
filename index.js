const d2gsi = require('dota2-gsi');

const announce = require('./announce');
const runes = require('./runes');

const server = new d2gsi();

server.events.on('newclient', function(client) {
    console.log("New GSI client connection, IP address: " + client.ip);
    if (client.auth && client.auth.token) {
        console.log("GSI Auth token: " + client.auth.token);
    } else {
        console.log("No GSI Auth token");
    }

    client.on(runes.event, (time) => announce(runes.handler(time)))
});
