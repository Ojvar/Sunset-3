"use strict";

const Crypto = require("crypto");
const CryptoConfig = config("back-end/crypto");

/**
 * Crypto Helper function
 */
function CryptoHelper() {}
module.exports = CryptoHelper;

/**
 * Make an encrypted text
 * @param {String} cleanText clean text
 */
CryptoHelper.encrypt = function encrypt(cleanText) {
    let mykey = Crypto.createCipher(
        CryptoConfig.cryptoAlgorithm,
        CryptoConfig.cryptoKey
    );
    let mystr = mykey.update(cleanText, "utf8", "hex");
    mystr += mykey.final("hex");

    return mystr;
};

/**
 * Make an encrypted text
 * @param {String} cypherText encrypted text
 */
CryptoHelper.decrypt = function decrypt(cypherText) {
    let mykey = Crypto.createCipher(
        CryptoConfig.cryptoAlgorithm,
        CryptoConfig.cryptoKey
    );
    let mystr = mykey.update(cypherText, "hex", "utf8");
    mystr += mykey.final("utf-8");

    return mystr;
};
