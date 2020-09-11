"use strict";

/* Get Home router */
const router = Router.router();

router.get("/:name?", "home@index", "home.index");
