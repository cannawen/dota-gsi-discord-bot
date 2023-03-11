import GSI = require("dota2-gsi");
import log = require("npmlog");

import announce from "./announce";
import handler from "./runes/runes";

const server = new GSI();

server.events.on("newclient", (client) => {
    log.info("Dota 2 GSI", "New client connection, IP address:", client.ip);
    if (client.auth && client.auth.token) {
        log.info("Dota 2 GSI", "Auth token:", client.auth.token);
    } else {
        log.info("Dota 2 GSI", "No auth token");
    }

    client.on("map:clock_time", (time: number) => announce(handler(time)));
});
