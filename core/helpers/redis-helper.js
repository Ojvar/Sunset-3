"use strict";

const _ = require("lodash");
const Redis = require("redis");

/**
 * Redis helper class
 */
function RedisHelper() {
    this.client = null;
}
module.exports = RedisHelper;

/**
 * Create a new redis client instance
 * @param {Object} options Redis initializtion data
 */
RedisHelper.create = function create(options) {
    return new Promise((resolve, reject) => {
        const client = new RedisHelper();
        let redisSettings = config("core/server", "redis");

        redisSettings = _.merge(redisSettings, options);
        client.init(redisSettings);

        resolve(client);
    });
};

/**
 * Connect to redis
 * @param {Object} options Connection options
 */
RedisHelper.prototype.init = function init(options) {
    return new Promise((resolve, reject) => {
        this.client = Redis.createClient(options);
        this.client.on("error", function(error) {
            console.error(error);
        });
        resolve(this.client);
    });
};

/**
 * Do a redis action
 */
RedisHelper.prototype.doAction = function doAction() {
    return new Promise((resolve, reject) => {
        const cmd = arguments[0];
        const key = arguments[1];
        const value = arguments[2];

        /* Validation */
        if (null == this.client) {
            reject(new Error("Redis client is null"));
            return;
        }
        if (!this.client[cmd]) {
            reject(new Error("Redis method is undefined"));
            return;
        }

        /* Do action */
        const resFunction = (err, result) => {
            if (err) {
                Logger.error(err);
                reject(err);
            } else {
                resolve(result);
            }
        };

        if (null != value) {
            this.client[cmd](key, value, resFunction);
        } else {
            this.client[cmd](key, resFunction);
        }
    });
};
