"use strict";

const FS = require("fs");
const Path = require("path");

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
    return new Promise((resolve, reject) => {
        Promise.all([
            this.loadServices("core/services"),
            this.loadServices("back-end/services"),
        ])
            .then((res) => resolve())
            .catch((err) => reject(err));
    });
};

/**
 * Load core services
 */
Services.loadServices = function loadServices(servicesPath) {
    return new Promise(async (resolve, reject) => {
        const basePath = rPath(servicesPath);
        const files = FS.readdirSync(basePath).filter(
            (file) => Path.extname(file).toLowerCase() == ".js"
        );

        for (let fileIndex in files) {
            let file = files[fileIndex];

            if (file.toLowerCase().endsWith("js")) {
                const Service = use(basePath, file);
                await Service.boot();
            }
        }

        resolve();
    });
};
