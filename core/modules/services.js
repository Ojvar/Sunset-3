"use strict";

const Glob = require("glob");

/**
 * Services module
 */
function Services() {}
module.exports = Services;

/**
 * Boot function
 * @param {Object} Bootstrap Bootstrap instance
 */
Services.boot = function boot(Bootstrap) {
    return Promise.all([
        Services.loadServices("core/services"),
        Services.loadServices("back-end/services"),
    ]);
};

/**
 * Load core services
 */
Services.loadServices = async function loadServices(servicesPath) {
    const basePath = rPath(servicesPath, "**/*.js");
    const files = Glob.sync(basePath);

    for (let fileIndex in files) {
        let file = files[fileIndex];

        const Service = use(file);
        await Service.boot();

        Logger.info(`>>\tService loaded : ${file}`);
    }
};
