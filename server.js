"use strict";

const Path = require("path");
const Bootstrap = require(Path.resolve("core/bootstrap"));

Bootstrap.boot().then((res) => {
    if (process.env.CREATE_ROUTE_MANIFEST == "yes") {
        process.exit(0);
    }
});
