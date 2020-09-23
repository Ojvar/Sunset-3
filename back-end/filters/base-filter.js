"use strict";

/**
 * Base filter
 */
function BaseFilter() {}
module.exports = BaseFilter;

/**
 * Filter function
 * @param {Object} data data
 * @param {Function} filterFnc Filter function
 */
BaseFilter.filter = async function filter(data, filterFnc) {
    let isArray = Array.isArray(data);

    if (!isArray) {
        data = [data];
    }

    data = data.map(filterFnc);

    if (!isArray) {
        return data[0];
    } else {
        return data;
    }
};
