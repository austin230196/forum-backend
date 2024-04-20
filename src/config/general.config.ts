import fs from "fs";

import {config} from "dotenv";

config();


export default {
    PORT: process.env.PORT || 5000,
    HOST: process.env.HOST || 'localhost',
    DATABASE_URL: process.env.DATABASE_URL || '',

    SALT: 10,

    PUBLIC_KEY: fs.readFileSync(process.env.PUBLIC_KEY_PATH || '', {encoding: 'utf-8'}),
    PRIVATE_KEY: fs.readFileSync(process.env.PRIVATE_KEY_PATH || '', {encoding: 'utf-8'}),

    ACCESS_TOKEN_TTL: '15m',
    REFRESH_TOKEN_TTL: '1y',
    FORGOT_PASSWORD_TOKEN_TTL: '30m',

    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PORT:  process.env.SMTP_PORT,

    REDIS_KEY: 'forum-clients',
    MAIN_QUEUE_NAME: 'forum-queue',
    VALID_PROVIDERS: ["google", "github"],

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
    GITHUB_URL: process.env.GITHUB_URL || '',
    GITHUB_USER_URL: process.env.GITHUB_USER_URL || '',
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || "https://api.programmable-forum.online/api/v1/login/provider/callback",

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || '',

    CLOUDINARY_APP_NAME: process.env.CLOUDINARY_APP_NAME ?? '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ?? '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? '',

    WEB_APP_URL: process.env.WEB_APP_URL ?? '',
    AMQP_URL: process.env.AMQP_URL ?? ''
}