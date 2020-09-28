"use strict";

const Winston = require("winston");

/**
 * Module
 */
function Logger() {}
module.exports = Logger;

/* Defaults */
Logger.Logger = console;

/**
 * Boot function
 */
Logger.boot = async function boot(Bootstrap) {
    const Config = config("core/server", "logger");

    Logger.Logger = Logger.setupWinston(Config);
    global.Logger = Logger.Logger;
};

/**
 * Boot function
 */
Logger.setupWinston = function setupWinston(Config) {
    const logger = Winston.createLogger({
        level: Config.level,
        format: Winston.format.combine(Winston.format.simple()),
    });

    if (process.env.NODE_ENV !== "production") {
        logger.add(
            new Winston.transports.Console({
                format: Winston.format.combine(
                    Winston.format.colorize(),
                    Winston.format.simple()
                ),
            })
        );
    } else {
        logger.add(
            new Winston.transports.File({
                filename: rPath(Config.path, "error.log"),
                level: "error",
            })
        );
    }

    logger.add(
        new Winston.transports.File({
            filename: rPath(Config.path, "all.log"),
        })
    );

    return logger;
};
