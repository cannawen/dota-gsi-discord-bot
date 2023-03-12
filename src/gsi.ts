import timeHandler from "./events/TimeHandler";

export default function run(client: { ip: any; auth: { token: any; }; on: any; }) {
    client.on("map:clock_time", (time: number) => {
        timeHandler(time);
    });
}
