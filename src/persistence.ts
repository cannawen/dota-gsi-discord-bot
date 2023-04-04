/* eslint-disable sort-keys */
import { createClient } from "redis";
import dotenv = require("dotenv");
import log from "./log";
dotenv.config();

const redisUrl = process.env.REDIS_URL;

async function saveData(allData: string) {
    try {
        log.info("app", "Saving data in redis %s", allData.magenta);
        const client = createClient({
            url: redisUrl,
            socket: {
                family: 6,
                reconnectStrategy: false,
            },
        });

        await client.connect();

        await client.set("restore", allData, { EX: 3600 });

        await client.quit();
    } catch (error) {
        log.warn("app", "Unable to save data to redis, %s", error);
    }
}

async function readData() {
    try {
        const client = createClient({
            url: redisUrl,
            socket: {
                family: 6,
                reconnectStrategy: false,
            },
        });

        await client.connect();

        const dataPromise = await client.get("restore").then((data) => {
            log.info("app", "Reading data from redis %s", data?.magenta);
            return data;
        });

        client.quit();

        return dataPromise;
    } catch (error) {
        log.warn("app", "Unable to read data from redis, %s", error);
    }
}

export default {
    saveData,
    readData,
};
