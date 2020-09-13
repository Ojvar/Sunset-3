"use strict";

module.exports = {
    mongodb: {
        db: process.env.DB_NAME || "sunset_db",
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 27017,
        user: process.env.DB_USER,
        pwd: process.env.DB_PWD,
        options: {
            useFindAndModify: false,
            useCreateIndex: true,
            uri_decode_auth: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: process.env.DB_TIME_OUT || 5000,
        },
    },
};
