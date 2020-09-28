"use strict";

const _ = require("lodash");
const Colors = require("colors");
const FS = require("fs");
const Path = require("path");
const DotEnv = require("dotenv");

/**
 * Module
 */
function Core() {}
module.exports = Core;

/**
 * Boot function
 */
Core.boot = async function boot(Bootstrap) {
    Core.configDotEnv();

    global.Colors = Colors;
    global.isProductionMode = Core.isProductionMode;
    global.rPath = Core.rPath;
    global.use = Core.use;
    global.config = Core.config;
    global.mix = Core.mix;
};

/**
 * Config DotEnv
 */
Core.configDotEnv = function configDotEnv() {
    let dotEnvFile;

    if (process.env.ENV_FILE) {
        dotEnvFile = process.env.ENV_FILE;
    } else if (Core.isProductionMode()) {
        dotEnvFile = ".env.prod";
    } else {
        dotEnvFile = ".env";
    }

    const confData = FS.readFileSync(dotEnvFile);
    const envConfig = DotEnv.parse(confData);

    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
};

/**
 * Is production mode
 */
Core.isProductionMode = function isProductionMode() {
    return process.env.NODE_ENV == "production";
};

/**
 * Relative path
 */
Core.rPath = function rPath() {
    return Path.resolve(...arguments);
};

/**
 * Ues a module
 */
Core.use = function use() {
    const path = Core.rPath(...arguments);
    return require(path);
};

/**
 * Load config data
 */
Core.config = function config(name, attrPath, defaultVal) {
    const configData = Core.use("config", name);

    if (null != attrPath) {
        return _.get(configData, attrPath, defaultVal);
    } else {
        return configData || defaultVal;
    }
};

/**
 * Get versionized name of an asset
 * @param {String} raw asset filename
 */
Core.mix = function mix(file) {
    if (!file.startsWith("/")) {
        file = "/" + file;
    }

    if (!Core.mixManifest) {
        try {
            Core.mixManifest = Core.use("public/mix-manifest.json");
        } catch (err) {
            Logger.error(err);
            return err;
        }
    }

    return Core.mixManifest[file];
};
