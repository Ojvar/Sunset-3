"use strict";

/**
 * Route Helper
 */
function RouterHelper(Router, newRouter, groupName) {
    this.Router = Router;
    this.router = newRouter;
    this.groupName = groupName || "";

    /* Use method */
    this.use = function use() {
        newRouter.use(...arguments);
    };

    /* Types */
    const types = [
        "get",
        "head",
        "post",
        "patch",
        "put",
        "delete",
        "options",
        "link",
    ];
    types.forEach((type) => {
        this[type] = (url, functions, alias) => {
            /* Add route to router */
            newRouter[type](url, RouterHelper.parseFunctions(functions));

            /* Add route alias */
            if (null != alias) {
                let stack = (newRouter._router || newRouter).stack;
                let newRoute = stack[stack.length - 1];

                /* Add to routes list */
                Router.addRoute(newRoute, alias, groupName);
            }
        };
    });

    // this.redirect = RouterHelper.redirect(Router);
}
module.exports = RouterHelper;

/**
 * Add route to router
 * @param {String} type Route type
 * @param {String} url Url
 * @param {Object|String|Array} functions functions
 * @param {String} alias Route alias
 */
RouterHelper.prototype.addRoute = function addRoute(
    type,
    url,
    functions,
    alias
) {};

/**
 * Redirect
 * @param {Object} Router Router
 */
RouterHelper.redirect = function redirect(Router) {
    return (to) => {
        Logger.log("Redirct", to);
    };
};

/**
 * Create an new router wrapper object
 * @param {Router} router Router Object
 * @param {Router} newRouter New Router Object
 */
RouterHelper.newRouter = function newRouter(Router, newRouter, groupName) {
    return new RouterHelper(Router, newRouter, groupName);
};

/**
 * Parse functions
 * @param {Any} functions Functions
 */
RouterHelper.parseFunctions = function parseFunctions(functions) {
    const controllerPostfix = "-controller";
    const actionSeparator = "@";
    let funcs = [];

    /* Convert to array */
    if (!Array.isArray(functions)) {
        functions = [functions];
    }

    /* Parse array items */
    functions.forEach((fnc) => {
        const fncType = typeof fnc;

        if ("string" == fncType) {
            let tokens = fnc.split(actionSeparator);

            if (tokens.length != 2) {
                throw new Error("Invalid call string, Controller@Action");
            }

            if (!tokens[0].endsWith(controllerPostfix)) {
                tokens[0] += controllerPostfix;
            }

            const controller = use(`back-end/controllers/${tokens[0]}`);
            funcs.push(controller[tokens[1]]);
        } else {
            funcs.push(fnc);
        }
    });

    return funcs;
};
