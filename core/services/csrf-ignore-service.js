"use strict";

/**
 * Service
 */
function Service() {}
module.exports = Service;

/**
 * csrfCheck function
 */
Service.boot = async function boot() {
    const csrfRules = config("core/csrf-rules");
    const rules = csrfRules.CSRFIgnoreRules || [];

    global.useCSRF = (req, res, next) =>
        rules.find((rule) => req.originalUrl.match(new RegExp(rule)));
};
