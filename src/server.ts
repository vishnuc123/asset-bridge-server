import { connectDb } from "./infrastructure/config/connect-db";
import { Settings } from "./settings/app";

const app = new Settings()
const startServer = async () => {
    try {
        await connectDb()

    } catch (error) {
        console.error("server failed to start", error)
    }
}

startServer();
