"use strict";

const { config } = require("winston");

/**
 * DatabaseModule module
 */
function DatabaseModule() {}
module.exports = DatabaseModule;

/**
 * Boot function
 * @param {Object} Bootstrap Bootstrap instance
 */
DatabaseModule.boot = function boot(Bootstrap) {
    return new Promise((resolve, reject) => {
        const Config = global.config("core/server", "database");

        try {
            const db = DatabaseModule.loadDriver(Config);
            global.db = db;

            if (!config.lazyConnect) {
                db.connect()
                    .then((res) => {
                        Logger.info("Connecting to database successfully");
                        resolve();
                    })
                    .catch((err) => {
                        Logger.error(">! Database connection failed");
                        Logger.error(err);

                        reject(err);
                    });
            }
        } catch (err) {
            Logger.error(err);
            reject(err);
        }
    });
};

/**
 * Listen
 * @param {Object} Config Config object
 */
DatabaseModule.loadDriver = function loadDriver(config) {
    const path = rPath(`core/helpers/database-drivers/${config.driver}`);
    const driverModule = use(path);

    return driverModule.init(config);
};
