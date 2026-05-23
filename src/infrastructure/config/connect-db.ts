import { env } from "../../shared/constants/env"
import mongoose from "mongoose"
import { logger } from "../../shared/utils/Logger"

export const connectDb = async (): Promise<void> => {
    try {
        const connection = await mongoose.connect(env.MONGO_DB_URL as string)
        logger.info("mongodb connected successfully")
        console.log("mongodb connected succesffully")
    } catch (error) {
        console.log(error, "error while connecting mongodb")
    }
}