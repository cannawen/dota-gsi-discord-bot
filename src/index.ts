/* eslint-disable @typescript-eslint/no-var-requires */
const d2gsi = require("dota2-gsi");
import gsi from "./gsi";
import log = require("npmlog");

const server = new d2gsi();
server.events.on("newclient", (client: { ip: any; auth: any; on: any; }) => {
    log.info("Dota 2 GSI", "New client connection, IP address:", client.ip);
    if (client.auth && client.auth.token) {
        log.info("Dota 2 GSI", "Auth token:", client.auth.token);
    } else {
        log.info("Dota 2 GSI", "No auth token");
    }
    gsi(client);
});
