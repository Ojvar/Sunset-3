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
Controller.login = function login(req, res, next) {
    res.render("auth/login.pug", { req });
};

/**
 * Logout action
 * @param {Request} req Request
 * @param {Response} res Response
 * @param {Function} next Callback
 */
Controller.logout = function logout(req, res, next) {
    req.session.auth = null;

    res.redirect(Router.routePath("home.index"));
};

/**
 * Attempt action
 * @param {Request} req Request
 * @param {Response} res Response
 * @param {Function} next Callback
 */
Controller.attempt = function attempt(req, res, next) {
    req.session.auth = {
        id: "5f1fd070e0efdd7db92f4251",
        name: "root",
        login_at: new Date(),
    };

    res.status(201).send({
        success: true,
        data: req.session.auth,
    });
};
