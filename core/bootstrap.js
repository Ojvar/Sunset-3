"use strict";

const Path = require("path");

/**
 * Boot strap function
 */
function Bootstrap() {}
module.exports = Bootstrap;

/**
 * Boot function
 */
Bootstrap.boot = function boot() {
    const config = require(Path.resolve("config/core/bootstrap"));

    global.Logger = console;
    return Bootstrap.loadModules(config);
};

/**
 * Load modules
 * @param {Object} config Config data
 */
Bootstrap.loadModules = function loadModules(config) {
    return new Promise(async (resolve, reject) => {
        const path = Path.resolve(__dirname, "modules");
        const modules = Object.keys(config.modules)
            .sort()
            .map((x) => config.modules[x]);

        for (let moduleIndex in modules) {
            const module = modules[moduleIndex];
            const fullPath = Path.resolve(path, module);

            /* Check module exists */
            const ModuleFile = require(fullPath);

            if (!ModuleFile) {
                Logger.error("Module not found " + fullPath);
                process.exit(1);
            } else {
                await ModuleFile.boot(Bootstrap);
                Logger.info(`Module ${module} loaded successfully`);
            }
        }

        /* Make route-manifest file */
        Router.makeManifest();

        resolve();
    });
};
