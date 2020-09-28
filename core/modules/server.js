"use strict";

const Http = require("http");
const Https = require("https");
const FS = require("fs");

/**
 * Server module
 */
function Server() {}
module.exports = Server;

/**
 * Boot function
 * @param {Object} Bootstrap Bootstrap instance
 */
Server.boot = function boot(Bootstrap) {
    const Config = global.config("core/server");

    return Server.listen(Config);
};

/**
 * Listen
 * @param {Object} Config Config object
 */
Server.listen = async function listen(Config) {
    let server =
        Config.https === true
            ? Server.startHttps(Config)
            : Server.startHttp(Config);

    const deafultPort = Config.https ? 443 : 80;
    const serverUrl =
        (Config.https ? "https://" : "http://") +
        Config.host +
        (Config.port != deafultPort ? `:${Config.port}` : "");
    server.listen(Config.port, Config.host, () => {
        /* Start listening */
        const msg = `
Server started at
https://${Config.host}:${Config.port}
    {
        Host: ${Config.host}
        Port: ${Config.port}
        Url(SERVER-SIDE): ${Config.serverUrl}
        Url(CLIENT-SIDE): ${serverUrl}
    }
`;
        Logger.info(msg);

        /* Raise server-boot event */
        global.raiseEvent("ServerBoot", {
            date: new Date(),
        });
    });

    global.serverUrl = Config.serverUrl;
    global.Server = server;
};

/**
 * Start Http engine
 * @param {Object} Config Config object
 */
Server.startHttp = function startHttp(Config) {
    const httpServer = Http.createServer(global.App);

    Logger.info("> Create Http Server");
    return httpServer;
};

/**
 * Start Https engine
 * @param {Object} Config Config object
 */
Server.startHttps = function startHttps(Config) {
    const options = {
        key: FS.readFileSync(rPath("config/core/ssl/key.pem")),
        cert: FS.readFileSync(rPath("config/core/ssl/cert.pem")),
        dhparam: FS.readFileSync(rPath("config/core/ssl/dhparam.pem")),
    };
    const httpsServer = Https.createServer(options, global.App);

    Logger.info("> Create Https Server");
    return httpsServer;
};
