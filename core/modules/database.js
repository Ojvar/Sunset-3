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

        DatabaseModule.loadDriver(Config)
            .then((res) => {
                global.db = res;

                if (!config.lazyConnect) {
                    res.connect()
                        .then((res) =>
                            Logger.info("> Connecting to database successfully")
                        )
                        .catch((err) => {
                            if (!isProductionMode()) {
                                console.error(err);
                            }
                            Logger.error(">! Database connection failed");
                        });
                }
                resolve();
            })
            .catch((err) => {
                Logger.error(err);
                reject(err);
            });
    });
};

/**
 * Listen
 * @param {Object} Config Config object
 */
DatabaseModule.loadDriver = function loadDriver(config) {
    return new Promise((resolve, reject) => {
        try {
            const path = rPath(
                `core/helpers/database-drivers/${config.driver}`
            );
            const driverModule = use(path);

            driverModule
                .init(config)
                .then((engine) => resolve(engine))
                .catch((err) => reject(err));
        } catch (err) {
            reject(err);
        }
    });
};
