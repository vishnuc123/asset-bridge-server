import { createClient } from "redis";
import { env } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/Logger";


export const redisClient = createClient({
    url: env.REDIS_URL as string
});

redisClient.on("error", (err:any) => {
    logger.error({
        msg: "Redis Error",
        error: err.message,
        stack: err.stack
    });
});

redisClient.on("connect", () => {
    logger.info("Redis connecting...");
});

redisClient.on("ready", () => {
    logger.info("Redis intitilized");
});

redisClient.on("end", () => {
    logger.warn("Redis closed");
});

export async function connectRedis() {
    try {
        await redisClient.connect();

        logger.info({
            msg: "Redis connected",
            url: env.REDIS_URL
        });

    } catch (error: any) {
        logger.error({
            msg: "Redis connection failed",
            error: error.message,
            stack: error.stack
        });

        throw error;
    }
}