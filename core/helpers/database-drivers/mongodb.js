"use strict";

const Mongoose = require("mongoose");
const FS = require("fs");
const Path = require("path");

/**
 * Driver module
 */
function Driver(config) {
    this.engine = null;
    this.config = config || {};
}
module.exports = Driver;

/**
 * Initialize driver
 */
Driver.init = function init(config) {
    let driver = new Driver(config);

    return driver;
};

/**
 * Generate the connection string
 * @param {Object} config Config object
 */
Driver.getConnectionString = function getConnectionString(config) {
    const host = config.host || "localhost";
    const port = config.port ? ":" + config.port : config.port;

    return `mongodb://${host}${port}/${config.db}`;
};

/**
 * Connect function
 */
Driver.prototype.connect = function connect() {
    return new Promise((resolve, reject) => {
        const databaseConfig = config("core/db", "mongodb");
        const connString = Driver.getConnectionString(databaseConfig);

        this.engine = Mongoose.connect(
            connString,
            databaseConfig.options,
            (err, res) => {
                if (err) {
                    Logger.error(err);
                    reject(err);
                } else {
                    /* Try to init models */
                    this.initModels(this.engine)
                        .then((res) => resolve(this))
                        .catch((err) => reject(err));
                }
            }
        );
    });
};

/**
 * Init models
 */
Driver.prototype.initModels = async function initModels(engine) {
    const basePath = rPath("back-end/models");
    const models = FS.readdirSync(basePath).filter(
        (file) => Path.extname(file).toLowerCase() == ".js"
    );

    await models.forEach(async (file) => {
        const Model = use(basePath, file);

        let model = await Model.init();
        Logger.info(`DB-Model ${model.name} initialized successfully`);
    });
};

/**
 * Get the model
 * @param {String} name Model name
 */
Driver.prototype.model = function model(name) {
    return Mongoose.model(name);
};
