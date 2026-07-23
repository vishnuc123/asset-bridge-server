import dotenv from "dotenv"
dotenv.config()


export const env = {
    PORT: process.env.PORT,
    EMAIL: process.env.EMAIL,
    EMAIL_PASS: process.env.EMAIL_PASS,
    REDIS_URL: process.env.REDIS_URL,
    MONGO_DB_URL: process.env.DB_CONNECTION_STRING,
    CLIENT_URL: process.env.CLIENT_URL as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_REFREASH_SECRET: process.env.JWT_REFREASH_SECRET as string,
    GOOGLE_ID: process.env.GOOGLE_ID,
    LOCAL_IP:process.env.LOCAL_IP as string
}