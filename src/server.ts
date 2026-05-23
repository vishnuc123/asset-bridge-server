import { connectDb } from "./infrastructure/config/connect-db";
import { connectRedis } from "./infrastructure/config/redis/redis";
import { Settings } from "./settings/app";
import { env } from "./shared/constants/env";

const app = new Settings()
const startServer = async () => {
    try {
        await connectDb()
        await connectRedis()

        app.listen(Number(env.PORT) || 2000)
    } catch (error) {
        console.error("server failed to start", error)
    }
}

startServer();
