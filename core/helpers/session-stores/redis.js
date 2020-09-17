"use strict";

const RedisStore = require("connect-redis");
const RedisHelper = use("core/helpers/redis-helper");

/**
 * Session store class
 */
function SessionStore() {}
module.exports = SessionStore;

/**
 * Init session-store
 * @param {Object} session Session object
 * @param {Object} config Config object
 */
SessionStore.make = async function make(session, config) {
    /* Create a new instance of redis-client */
    const redisClient = await RedisHelper.create();

    /* Try to create redis-store */
    const redisStore = RedisStore(session);
    const result = new redisStore({
        client: redisClient.client,
    });

    return result;
};
