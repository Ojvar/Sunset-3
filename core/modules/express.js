'use strict';

const FS = require('fs');
const Express = require('express');
const bodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const CSURF = require('csurf');
const Helmet = require('helmet');

/**
 * Module
 */
function ExpressModule() { }
module.exports = ExpressModule;

/**
 * Boot function
 */
ExpressModule.boot = function boot(Bootstrap) {
    return new Promise((resolve, reject) => {
        const Config = config('core/server', 'express');
        global.App = ExpressModule.setupExpress(Config);

        resolve();
    });
};

/**
 * Setup express
 * @param {Object} config Config data
 */
ExpressModule.setupExpress = function setupExpress(config) {
    const app = Express();

    /* Add static folder */
    config.publicFolder.split(',')
        .forEach(path => {
            app.use(Express.static(rPath(path)))
        });

    /* Setup template engine */
    app.set('view engine', 'pug');
    app.set('views', rPath(config.viewsFolder));

    /* Add middlewars */
    ExpressModule.addMiddleware(app, config);

    /* Add middlewars */
    ExpressModule.loadCoreMiddlewares(app);

    return app;
};

/**
 * Add middlewares
 * @param {Object} app App instance
 * @param {Object} config Config data
 */
ExpressModule.addMiddleware = function addMiddleware(app, config) {
    /* Compression */
    ExpressModule.setupCompression(app, config);

    /* Add cookie-parse */
    app.use(CookieParser());

    /* Add body parser */
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());

    /* Helmet */
    app.use(Helmet());

    /* CSRF */
    global.csrf = CSURF({
        cookie: true
    });
};

/**
 * Apply compression
 * @param {App} App App instance
 * @param {Object} config Config object
 */
ExpressModule.setupCompression = function setupCompression(app, config) {
    const compressionValue = (config.compression || '').toLowerCase();

    if (compressionValue == 'gzip') {
        const Compression = require('compression');
        app.use(Compression());

        Logger.info('> Comporession Enabled');
    }
};

/**
 * Load core middlewares
 */
ExpressModule.loadCoreMiddlewares = function loadCoreMiddlewares(app) {
    const dirPath = rPath('core/middlewares');
    let queue = [dirPath];

    while (queue.length) {
        /* Get first element */
        const currentFile = queue[0];

        /* Remove first element */
        queue.splice(0, 1);

        /* Check path type (file or directory) */
        const isDirectory = FS.lstatSync(currentFile)
            .isDirectory();

        if (isDirectory) {
            FS.readdirSync(currentFile)
                .forEach(file => {
                    queue.push(rPath(currentFile, file));
                });
        } else {
            const middleware = use(currentFile);
            app.use(middleware);
        }
    }
};