"use strict";

const MemoryStore = require("memorystore");

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
SessionStore.make = function make(session, config) {
    return new Promise((resolve, reject) => {
        /* Try to create redis-store */
        const memoryStore = MemoryStore(session);
        const result = new memoryStore({
            checkPeriod: config.maxAge,
        });

        resolve(result);
    });
};
