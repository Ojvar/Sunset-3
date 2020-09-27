"use strict";

/**
 * Exports
 */
module.exports = {
    cryptoKey:
        process.env.CRYPTO_KEY || "crypto_key" + Math.random().toString(),
    cryptoAlgorithm: process.env.CRYPTO_ALGORITHM || "aes-128-cbc",
};
