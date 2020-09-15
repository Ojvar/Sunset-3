"use strict";

const Express = require("express");
const FS = require("fs");
const Path = require("path");
const RouterHelper = use("core/helpers/router-helper");

const C_DEF_ROUTE = "";

/**
 * Router module
 */
function Router() {}
module.exports = Router;

/* Defaults */
Router._routes = {};
Router._routers = {};

/**
 * Boot function
 * @param {Object} Bootstrap Bootstrap module
 */
Router.boot = function boot(Bootstrap) {
    return new Promise((resolve, reject) => {
        global.Router = Router;
        Router.loadRoutes();
        Router.addEventHandler();

        resolve(Router);
    });
};

/**
 * Load routers
 */
Router.loadRoutes = function loadRoutes() {
    const path = rPath("routes");
    const routes = FS.readdirSync(path).filter(
        (file) => Path.extname(file).toLowerCase() == ".js"
    );

    /* Load routes */
    routes.forEach((route) => use(path, route));

    /* Use routes */
    Object.keys(Router._routers).forEach((routerName) => {
        const router = Router._routers[routerName];
        let rName = routerName;

        if (!rName.startsWith("/")) {
            rName = "/" + rName;
        }

        if (router.router != global.App) {
            router.__baseRoute = rName;
            global.App.use(rName, router.router);
        }
    });
};

/**
 * addEventHandler
 */
Router.addEventHandler = function addEventHandler() {
    /* Add Error handler */
    global.App.use((err, req, res, next) => {
        console.error(err);
        let message = "Internal server error";

        if ("development" === process.env.NODE_ENV) {
            message += "\n" + JSON.stringify(err);
        }

        if (Router.isAjax(req)) {
            res.status(500)
                .send(message)
                .end();
        } else if (req.accepts("html")) {
            res.render("errors/500.pug", {
                url: req.url,
                err: message,
            });
        } else {
            res.type("txt").send(message);
        }
    });

    /* Add Not found handler */
    global.App.use((req, res, next) => {
        if (Router.isAjax(req)) {
            res.status(404)
                .send("The requested route doesn't exist")
                .end();
        } else if (req.accepts("html")) {
            res.render("errors/404.pug", {
                url: req.url,
            });
        } else {
            res.type("txt").send("Not found");
        }
    });
};

/**
 * isAjax
 * @param {Request} req The request
 */
Router.isAjax = function isAjax(req) {
    return req.xhr || req.headers.accept.indexOf("json") > -1;
};

/* Get/New router */
Router.router = function router(groupName) {
    groupName = groupName || C_DEF_ROUTE;
    let router = Router._routers[groupName];

    if (null == router) {
        router = C_DEF_ROUTE == groupName ? global.App : Express.Router();
        router = RouterHelper.newRouter(Router, router, groupName);
        Router._routers[groupName] = router;
    }

    return router;
};

/**
 * Add new route alias
 * @param {Object} router Router object
 * @param {String} alias Alias
 */
Router.addRoute = function addRoute(router, alias, groupName) {
    Router._routes[alias] = {
        router,
        groupName,
    };
};

/**
 * Return route by alias
 * @param {Object} router Router object
 * @param {String} alias Alias
 */
Router.route = function route(alias) {
    return Router._routes[alias];
};

/**
 * Get router path
 * @param {Object} router Router object
 * @param {String} alias Alias
 */
Router.routePath = function routePath(alias, params) {
    let { groupName, router } = Router.route(alias);

    let path =
        (groupName != null ? "/" : "") + ("" + groupName) + router.route.path;
    path = path.replace(/\/\//g, "/");

    console.log(path)

    /* Replace params */
    if (null != params) {
        const pathParams = path.match(/(:\w+\??)/g) || [];

        pathParams.forEach((param) => {
            const key = param.replace(/[\:|\?]/g, "");
            const value = params[key] || "";

            path = path.replace(new RegExp(param + "\\?", "g"), value);
        });
    }

    /* Add prefix to path */
    const ServerConfig = config("core/server");
    let baseAddr = ServerConfig.https == true ? "https://" : "http://";
    path = `${baseAddr}${global.serverUrl}${path}`;

    return path;
};

/**
 * Make manifest file
 */
Router.makeManifest = function makeManifest() {
    return new Promise((resolve, reject) => {
        const { publicFolder } = config("core/server", "express");
        const filePath = rPath(publicFolder, "route-manifest.json");

        const routesList = {};
        Object.keys(Router._routes).forEach((x) => {
            const router = Router._routes[x];

            routesList[x] = {
                route: Router.routePath(x),
                groupName: router.groupName || "",
                subPath: router.router.route.path || "",
            };
        });

        /* Write to file */
        const fullPublicPath = rPath(publicFolder);
        if (!FS.existsSync(fullPublicPath)) {
            FS.mkdirSync(fullPublicPath);
        }
        FS.writeFileSync(filePath, JSON.stringify(routesList, null, 2));

        resolve();
    });
};
