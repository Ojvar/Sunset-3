'use strict';

const _ = require('lodash');
const Session = require('express-session');

/**
 * Session module
 */
function SessionModule() { }
module.exports = SessionModule;

/**
 * Boot function
 * @param {Object} Bootstrap Bootstrap data
 */
SessionModule.boot = function boot(Bootstrap) {
    const Config = config('core/server', 'session');

    return SessionModule.initSession(Config);
};

/**
 * Initialize the session
 * @param {Object} config Config object
 */
SessionModule.initSession = function initSession(config) {
    return new Promise((resolve, reject) => {
        let options = _.merge({}, {
            name: 'sess_id_',
            sessionType: 'memory',
            path: '/',
            saveUninitialized: true,
            reSave: false,
            httpOnly: true,
            secret: 'secretKey',
            secure: true,
            maxAge: (60000 * 15),
        }, config);

        if (isProductionMode) {
            App.set('trust proxy', 1);
        }

        SessionModule.makeStore(config, Session)
            .then(res => {
                options.store = res;
                const session = Session(options);

                App.use(session);

                resolve(session);
            });
    });
};

/**
 * Make store
 */
SessionModule.makeStore = function makeStore(config, session) {
    const path = rPath('core/helpers/session-stores/', config.sessionType);

    try {
        const storeModule = use(path);

        return storeModule.make(session, config);
    }
    catch (err) {
        Logger.debug(`! SessionStore ${config.sessionType} not found!`);
        Logger.error(err);
    }

    return new Promise((resolve, reject) => {
        resolve();
    });
};
