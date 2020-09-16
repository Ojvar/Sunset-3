"use strict";

import _ from "lodash";
import JsonFormData from "json-form-data";

/**
 * Axios Helper class
 */
function AxiosHelper() {}
export default AxiosHelper;

/**
 * Send ajax request
 */
AxiosHelper.send = function send(method, url, data = {}, options) {
    let postData;
    data = data || {};

    /* Setup options */
    options = _.merge(
        {
            headers: [],
            useCookie: true,
            sendAsFormData: false,
            filesArray: [],
        },
        options
    );

    if (!Array.isArray(options.filesArray)) {
        options.filesArray = [options.filesArray];
    }

    /* Check form-data flag */
    if (true == options.sendAsFormData) {
        postData = JsonFormData(data, {
            initialFormData: new FormData(),
            showLeafArrayIndexes: true,
            includeNullValues: false,
        });

        /* Setup header */
        options.headers["content-type"] = "multipart/form-data";
    } else {
        postData = data;

        if (options.jsonRequest || true) {
            options.headers["content-type"] = "application/json";
        }
    }

    let config = {
        method,
        withCredentials: options.useCookie,
        baseURL: options.baseURL,
        headers: options.headers,
    };

    if (null != postData.getHeaders) {
        config["headers"] = postData.getHeaders();
    }

    /* Add CSRF token */
    const csrf =
        options.csrfToken ||
        (
            document.querySelector('meta[name="csrf-token"]') || {
                content: "",
            }
        ).content;

    Axios.defaults.headers.common["X-CSRF-TOKEN"] = options.headers[
        "x-xsrf-token"
    ] = options.headers["x-csrf-token"] = options.headers[
        "xsrf-token"
    ] = options.headers["csrf-token"] = csrf;

    /* Add bearer token */
    if (null != options.token) {
        config.headers["authorization"] = `Bearer ${options.token}`;
    }

    /* Create axios instance */
    let instance = Axios.create(config);

    return instance[method](url, postData);
};

/* Add standard restful request types */
const types = ["get", "head", "post", "patch", "put", "options", "link"];
types.forEach((type) => {
    AxiosHelper[type] = function send(url, data, options) {
        return AxiosHelper.send(type, url, data, options);
    };
});
