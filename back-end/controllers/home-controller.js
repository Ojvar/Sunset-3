"use strict";

/**
 * Controller
 */
function Controller() {}
module.exports = Controller;

/**
 * Index action
 * @param {Request} req Request
 * @param {Response} res Response
 * @param {Function} next Callback
 */
Controller.index = function index(req, res, next) {
    res.render("home.pug", { req });
};
