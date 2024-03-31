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
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PORT:  process.env.SMTP_PORT,
    REDIS_KEY: 'forum-clients'
}