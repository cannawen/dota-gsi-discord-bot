const d2gsi = require('dota2-gsi');

const server = new d2gsi();

const WATER_RUNE_END_TIME = 4 * 60;
const RIVER_RUNE_SPAWN_INTERVAL = 2 * 60;
const BOUNTY_RUNE_SPAWN_INTERVAL = 3 * 60;

function announce(text) {
    console.log(text);
}

function pregame(time) {
    return time <= 0;
}

function waterRuneSpawning(time) {
    return riverRuneSpawning(time) && time <= WATER_RUNE_END_TIME;
}

function riverRuneSpawning(time) {
    return time % RIVER_RUNE_SPAWN_INTERVAL == 0;
}

function bountyRuneSpawning(time) {
    return time % BOUNTY_RUNE_SPAWN_INTERVAL == 0;
}

server.events.on('newclient', function(client) {
    console.log("New client connection, IP address: " + client.ip);
    if (client.auth && client.auth.token) {
        console.log("Auth token: " + client.auth.token);
    } else {
        console.log("No Auth token");
    }

    client.on('map:clock_time', (time) => {
        const leadTime = 20;
        const effectiveTime = time + leadTime;

        if (pregame(leadTime)) {
            return;
        } else if (waterRuneSpawning(effectiveTime)) {
            announce("water runes");
        } else if (riverRuneSpawning(effectiveTime) && bountyRuneSpawning(effectiveTime)) {
            announce("bounty and power runes");
        } else if (riverRuneSpawning(effectiveTime)) {
            announce("power rune");
        } else if (bountyRuneSpawning(effectiveTime)) {
            announce("bounty runes");
        }
    });
  });
