"use strict";

/**
 * Apply security
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Next() callback
 */
module.exports = function apply(req, res, next) {
    const auth = req.session.auth;

    if (null == auth) {
        res.redirect(Router.routePath("auth.login"));
    } else {
        next();
    }
};
