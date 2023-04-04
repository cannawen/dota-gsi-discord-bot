import { createClient } from "redis";
import dotenv = require("dotenv");
import log from "./log";
dotenv.config();

const redisUrl = process.env.REDIS_URL;

async function saveData(allData: string) {
    log.info("app", "Saving data in redis %s", allData.magenta);
    const client = createClient({
        url: redisUrl,
        socket: {
            reconnectStrategy: false,
        },
    });
    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();

    await client.set("restore", allData, { EX: 3600 });

    await client.quit();
}

async function readData() {
    const client = createClient({
        url: redisUrl,
        socket: {
            reconnectStrategy: false,
        },
    });
    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();

    const myKeyValue = await client.get("restore").then((data) => {
        log.info("app", "Reading data from redis %s", data?.magenta);
        return data;
    });

    client.quit();

    return myKeyValue;
}

export default {
    saveData,
    readData,
};
