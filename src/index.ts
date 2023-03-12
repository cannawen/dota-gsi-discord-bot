/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const d2gsi = require("dota2-gsi");
import log = require("npmlog");

import announce from "./announce";
import handler from "./events/runes";

const server = new d2gsi();

server.events.on("newclient", (client: { ip: any; auth: { token: any; }; on: (arg0: string, arg1: (time /* eslint-disable @typescript-eslint/no-unsafe-call */: number) => void) => void; }) => {
    log.info("Dota 2 GSI", "New client connection, IP address:", client.ip);
    if (client.auth && client.auth.token) {
        log.info("Dota 2 GSI", "Auth token:", client.auth.token);
    } else {
        log.info("Dota 2 GSI", "No auth token");
    }

    client.on("map:clock_time", (time: number) => announce(handler(time)));
});
