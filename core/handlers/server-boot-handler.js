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
    console.log("Server-Boot event raisd", payload);
};
