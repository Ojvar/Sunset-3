"use strict";

/**
 * Get headers
 */
function getHeaders() {
    const C_HEADER = "HEADER_";
    const customHeaders = {};

    Object.keys(process.env)
        .filter((key) => key.startsWith(C_HEADER))
        .forEach((key) => {
            const headerName = key.replace(C_HEADER, "").replace(/_/g, "-");

            customHeaders[headerName] = process.env[key];
        });

    return customHeaders;
}

/**
 * Export configs
 */
module.exports = {
    headers: getHeaders(),
};
