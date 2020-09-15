"use strict";

/**
 * Exports
 */
module.exports = {
    storage: process.env.UPLOAD_STORAGE || "storage/uploads",
    maxSize: process.env.UPLOAD_MAX_SIZE || 8 * 1024 * 1024 * 1, // 1 MB
};
