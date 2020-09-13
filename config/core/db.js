"use strict";

module.exports = {
    mongodb: {
        db: process.env.DB_NAME || "sunset_db",
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 27017,
        options: {
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            useFindAndModify: false,
            useCreateIndex: true,
            uri_decode_auth: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: process.env.DB_TIME_OUT || 5000,
        },
    },
};
