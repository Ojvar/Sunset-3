"use strict";

import Manfiest from "@PUBLIC/route-manifest.json";

/**
 * Route helper
 */
function RouteHelper() {}
export default RouteHelper;

/**
 * Get full route-path
 * @param {String} alias Route alias
 */
RouteHelper.routePath = function routePath(alias, params) {
    if (!RouteHelper.routeManfiest) {
        RouteHelper.routeManfiest = Manfiest;
    }

    let path = (RouteHelper.routeManfiest[alias] || {}).route || "";

    /* Replace params */
    const pathParams = path.match(/(\b\/:\w+\??\b)/g) || [];
    if (params != null) {
        pathParams.forEach((param) => {
            const key = param.replace(/[\:|\/|\?]/g, "");
            const value = params[key] || "";

            param = `/:${key}\\??`;
            path = path.replace(new RegExp(param), "/" + value);
        });
    }

    return path;
};
