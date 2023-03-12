import timeHandler from "./events/TimeHandler";
import log = require("npmlog");

export default function run(client: { ip: any; auth: { token: any; }; on: any; }) {
    client.on("map:clock_time", (time: number) => {
        timeHandler(time);
    });
    client.on("map:roshan_state", (x : string) => {
        // `roshan_base` when rosh is dead
        // `respawn_variable` when dead or alive
        // `alive` when rosh is alive
        log.info("map:roshan_state", x);
    });

    client.on("map:roshan_state_end_seconds", (x : number) => {
        // seconds remaining that rosh will remain in this state
        log.info("map:roshan_state_end_seconds", x.toString());
    });
}
