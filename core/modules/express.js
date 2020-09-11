"use strict";

const FS = require("fs");
const Path = require("path");
const Express = require("express");
const bodyParser = require("body-parser");
const CookieParser = require("cookie-parser");
const CSURF = require("csurf");
const Helmet = require("helmet");
const Morgan = require("morgan");
const RateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const Multer = require("multer");
const { uuidV4: v4 } = require("uuid");

/**
 * Module
 */
function ExpressModule() {}
module.exports = ExpressModule;

/**
 * Boot function
 */
ExpressModule.boot = async function boot(Bootstrap) {
    const Config = config("core/server", "express");

    global.App = ExpressModule.setupExpress(Config);
};

/**
 * Setup express
 * @param {Object} config Config data
 */
ExpressModule.setupExpress = function setupExpress(config) {
    const app = Express();

    /* Add static folder */
    config.publicFolder.split(",").forEach((path) => {
        app.use(Express.static(rPath(path)));
    });

    /* Setup template engine */
    app.set("view engine", "pug");
    app.set("views", rPath(config.viewsFolder));

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
ExpressModule.addMiddleware = function addMiddleware(app, expressConfig) {
    /* Compression */
    ExpressModule.setupCompression(app, expressConfig);

    /* Add morgan */
    if (isProductionMode()) {
        app.set("trust proxy", expressConfig.trustedProxy.split(/[\,\;]/g));
        app.use(Morgan("combined"));
    } else {
        app.use(Morgan("dev"));
    }

    /* Setup throttle */
    let store = null;

    if (expressConfig.throttleStore == "redis") {
        store = new RedisStore({});
    }
    global.limiter = new RateLimit({
        store,
        windowMs: +expressConfig.throttleWindow,
        max: +expressConfig.throttleMax,
        delayMs: +expressConfig.throttleDelay,
    });
    // app.use(limiter);

    /* Add cookie-parse */
    app.use(CookieParser());

    /* Add body parser */
    app.use(
        bodyParser.urlencoded({
            extended: false,
        })
    );
    app.use(bodyParser.json());

    /* Helmet */
    app.use(Helmet());

    /* CSRF */
    const csrf = CSURF({
        cookie: true,
    });
    app.use(csrf);
    app.use((req, res, next) => {
        res.locals.csrftoken = req.csrfToken();
        next();
    });

    /* Setup multer */
    const multerConfig = config("core/multer");
    const storage = Multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, multerConfig.storage);
        },
        filename: function(req, file, cb) {
            cb(null, uuidV4());
        },
    });

    global.upload = Multer({ storage: storage });
};

/**
 * Apply compression
 * @param {App} App App instance
 * @param {Object} config Config object
 */
ExpressModule.setupCompression = function setupCompression(app, config) {
    const compressionValue = (config.compression || "").toLowerCase();

    if (compressionValue == "gzip") {
        const Compression = require("compression");
        app.use(Compression());

        Logger.info("> Comporession Enabled");
    }
};

/**
 * Load core middlewares
 */
ExpressModule.loadCoreMiddlewares = function loadCoreMiddlewares(app) {
    const dirPath = rPath("core/middlewares");
    let queue = [dirPath];

    while (queue.length) {
        /* Get first element */
        const currentFile = queue[0];

        /* Remove first element */
        queue.splice(0, 1);

        /* Check path type (file or directory) */
        const isDirectory = FS.lstatSync(currentFile).isDirectory();

        if (isDirectory) {
            FS.readdirSync(currentFile)
                .filter((file) => Path.extname(file).toLowerCase() == ".js")
                .forEach((file) => {
                    queue.push(rPath(currentFile, file));
                });
        } else {
            const middleware = use(currentFile);
            app.use(middleware);
        }
    }
};
