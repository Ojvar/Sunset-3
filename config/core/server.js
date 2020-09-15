"use strict";

/**
 * IS-NULL function
 * @param {Object} value Object
 * @param {Object} defaultValue Default value
 */
function isNULL(value, defaultValue) {
    return value ? value : defaultValue;
}

const C_HOST = "localhost";
const C_PORT = isNULL(process.env.SERVER_PORT, 8585);

/**
 * Export config
 */
module.exports = {
    https: isNULL(process.env.SERVER_HTTPS, false) == "true",
    port: C_PORT,
    host: isNULL(process.env.SERVER_HOST, C_HOST),
    serverUrl: isNULL(process.env.SERVER_URL, `${C_HOST}:${C_PORT}`),

    express: {
        trusted_ips: process.env.SERVER_TRUSTED_IPS || "127.0.0.1,localhost",
        publicFolder: process.env.EXPRESS_PUBLIC || "public",
        viewsFolder: process.env.EXPRESS_VIEWS_PATH || "front-end/views",
        compression: process.env.SERVER_COMPRESSION || "gzip",
        cspDefaultSrc: process.env.CSP_POLICY_DEFAULT_SRC || "'self'",
        cspImgSrc: process.env.CSP_POLICY_IMG_SRC || "*",
        throttleStore: process.env.EXPRESS_THROTTLE_STORE || "memory",
        throttleWindow: process.env.EXPRESS_THROTTLE_WINDOW || 60 * 1000,
        throttleMax: process.env.EXPRESS_THROTTLE_MAX || 60,
        throttleDelay: process.env.EXPRESS_THROTTLE_DELAY || 0,
        trustedProxy:
            process.env.EXPRESS_TRUSTED_PROXY ||
            "loopback,linklocal,uniquelocal",
    },

    logger: {
        path: process.env.LOGGER_PATH || "logs",
        level: process.env.LOGGER_LEVEL || "silly",
    },

    redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        db: isNULL(process.env.REDIS_DB, 0),
        url: process.env.REDIS_URL,
    },

    session: {
        sessionType: isNULL(process.env.SESSION_TYPE, "memory"),
        resave: isNULL(process.env.SESSION_RESAVE, false),
        saveUninitialized: isNULL(process.env.SESSION_SAVE_UNINITIALIZED, true),
        secret: process.env.SESSION_SECRET || "$3crtKE`/00Sun53t",
        path: process.env.SESSION_PATH || "/",
        httpOnly: process.env.SESSION_HTTP_ONLY || true,
        secure:
            isNULL(process.env.SESSION_SECURE, process.env.SERVER_HTTPS) ==
            true,
        maxAge: process.env.SESSION_MAX_AGE || 60000 * 15,
    },

    database: {
        driver: "mongodb",
        lazyConnect: isNULL(process.env.DB_LAZY_CONNECT, false),
    },
};
