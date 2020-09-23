"use strict";

const CanHelper = use("back-end/helpers/can-helper");

/**
 * Service
 */
function Service() {}
module.exports = Service;

/**
 * Service
 */
Service.boot = function boot() {
    return new Promise((resolve, reject) => {
        global.can = CanHelper.can;
        Logger.info("> Can helper setuped");

        resolve();
    });
};
