"use strict";

/**
 * Handler
 */
function Handler() {}
module.exports = {
    name: "ServerBoot",
    handler: Handler,
};

/**
 * Handle function
 */
Handler.handle = async function handle(payload) {
    Logger.info("Server-Boot event raisd", payload);
};
