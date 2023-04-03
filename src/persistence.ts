import { createClient } from "redis";
import dotenv = require("dotenv");
dotenv.config();

const redisUrl = process.env.REDIS_URL;

async function persistData() {
    const client = createClient({
        url: redisUrl,
        socket: {
            reconnectStrategy: false,
        },
    });
    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();

    await client.set("mykey", "Hello from node redis", { EX: 3600 });

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

    const myKeyValue = await client.get("mykey");
    console.log(myKeyValue);

    await client.quit();
}

export default {
    persistData,
    readData,
};
