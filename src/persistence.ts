import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

async function persistData() {
    if (!redisUrl) return;

    const client = createClient({
        url: redisUrl,
    });
    await client.connect();

    await client.set("mykey", "Hello from node redis", { EX: 120 });

    await client.quit();
}

async function readData() {
    if (!redisUrl) return;

    const client = createClient({
        url: redisUrl,
    });
    await client.connect();

    const myKeyValue = await client.get("mykey");
    console.log(myKeyValue);

    await client.quit();
}

export default {
    persistData,
    readData,
};
