"use strict";

const Mongoose = require("mongoose");
const FS = require("fs");
const Path = require("path");

/**
 * Driver module
 */
function Driver() {
    this.engine = null;
}
module.exports = Driver;

/**
 * Initialize driver
 */
Driver.init = function init() {
    return new Promise((resolve, reject) => {
        let driver = new Driver();

        resolve(driver);
    });
};

/**
 * Generate the connection string
 * @param {Object} config Config object
 */
Driver.getConnectionString = function getConnectionString(config) {
    const host = config.host || "localhost";
    const port = config.port ? ":" + config.port : config.port;

    const user = config.user;
    const pwd = config.pwd ? ":" + encodeURIComponent(config.pwd) : config.pwd;
    const userPassStr = user ? `${user}${pwd}@` : "";

    return `mongodb://${userPassStr}${host}${port}/${config.db}`;
};

/**
 * Connect function
 */
Driver.prototype.connect = function connect() {
    return new Promise((resolve, reject) => {
        const databaseConfig = config("core/db", "mongodb");

        try {
            const connString = Driver.getConnectionString(databaseConfig);
            this.engine = Mongoose.connect(connString, databaseConfig.options);

            /* Try to init models */
            this.initModels(this.engine)
                .then((res) => resolve(this))
                .catch((err) => reject(err));
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * Init models
 */
Driver.prototype.initModels = function initModels(engine) {
    return new Promise((resolve, reject) => {
        const basePath = rPath("back-end/models");
        const models = FS.readdirSync(basePath).filter(
            (file) => Path.extname(file).toLowerCase() == ".js"
        );

        models.forEach((file) => {
            const Model = use(basePath, file);
            Model.init().then((model) => {
                Logger.info(
                    `> DB-Model ${model.name} initialized successfully`
                );
            });
        });

        resolve();
    });
};

/**
 * Get the model
 * @param {String} name Model name
 */
Driver.prototype.model = function model(name) {
    return Mongoose.model(name);
};
