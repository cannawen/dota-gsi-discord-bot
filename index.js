const GSI = require("dota2-gsi");
const log = require("npmlog");

const announce = require("./announce");
const runes = require("./runes/runes");

const server = new GSI();

server.events.on("newclient", (client) => {
    log.info("Dota 2 GSI", "New client connection, IP address:", client.ip);
    if (client.auth && client.auth.token) {
        log.info("Dota 2 GSI", "Auth token:", client.auth.token);
    } else {
        log.info("Dota 2 GSI", "No auth token");
    }

    client.on(runes.event, (time) => announce(runes.handler(time)));
});
