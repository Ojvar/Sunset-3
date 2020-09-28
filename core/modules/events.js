"use strict";

const Glob = require("glob");

/**
 * Events module
 */
function Events() {}
module.exports = Events;

/**
 * Boot function
 * @param {Object} Bootstrap Bootstrap instance
 */
Events.boot = function boot(Bootstrap) {
    Events.handlers = {};
    global.raiseEvent = Events.raiseEvent;

    return Promise.all([
        Events.loadHandlers("core/handlers"),
        Events.loadHandlers("back-end/handlers"),
    ]);
};

/**
 * Raise an event
 * @param {String} eventName Event name
 * @param {Object} payload Payload object
 */
Events.raiseEvent = async function raiseEvent(eventName, payload) {
    const event = Events.handlers[eventName];

    if (event) {
        event.handle(payload);
    }
};

/**
 * Load event-handlers
 */
Events.loadHandlers = async function loadHandlers(eventsPath) {
    const basePath = rPath(eventsPath, "**/*.js");
    const files = Glob.sync(basePath);

    for (let fileIndex in files) {
        let file = files[fileIndex];

        const Handler = use(file);
        Events.handlers[Handler.name] = Handler.handler;
        Logger.info(`Handler loaded : ${Handler.name}`);
    }
};
