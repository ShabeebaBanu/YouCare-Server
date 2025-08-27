import { createClient } from "redis";

const client = createClient({
    url: process.env.REDIS_URL
});

client.on("error", (err) => {
    console.error("Redis Client Error: ", err);
});

async function connectRedis() {
    try {
        await client.connect();
        console.log("Redis Connected Successfully");
    } catch (err) {
        console.log("Failed to connect to redis : ", err);
        process.exit(1);
    }
}

connectRedis();

export default client;