"use strict";

/**
 * Permission check
 * @param {Request} req The request
 * @param {Object} data Asdditional data
 */
module.exports = function(req, data) {
    return null != req.session.auth;
};
