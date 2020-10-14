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

    const printerFormat = Winston.format.printf(
        (info) =>
            `${info.timestamp} ${info.level}: ${info.message}` +
            (info.splat !== undefined ? `${info.splat}` : " ")
    );

    /* Console transporter */
    if (process.env.NODE_ENV !== "production") {
        logger.add(
            new Winston.transports.Console({
                format: Winston.format.combine(
                    Winston.format.colorize(),
                    Winston.format.timestamp({
                        format: "YYYY-MM-DD HH:mm:ss",
                    }),
                    printerFormat
                ),
            })
        );
    }

    /* Error transporter */
    logger.add(
        new Winston.transports.File({
            format: Winston.format.combine(
                Winston.format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss",
                }),
                printerFormat
            ),
            filename: rPath(Config.path, "error.log"),
            level: "error",
        })
    );

    /* Silly transporter */
    logger.add(
        new Winston.transports.File({
            format: Winston.format.combine(
                Winston.format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss",
                }),
                printerFormat
            ),
            filename: rPath(Config.path, "all.log"),
        })
    );

    return logger;
};
