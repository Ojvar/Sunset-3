"use strict";

const Config = config("core/security");

/**
 * Apply security
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next() callback
 */
module.exports = function apply(req, res, next) {
    const headers = Config.headers;

    Object.keys(headers).forEach((key) => {
        res.set(key, headers[key]);
    });

    next();
};
