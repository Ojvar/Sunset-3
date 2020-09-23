"use strict";

const ValidatorHelper = use("core/helpers/validator-helper");

/**
 * Validator
 */
function Validator() {}
module.exports = Validator;

/**
 * Validate function
 */
Validator.validate = function validate() {
    return ValidatorHelper.validate(Validator);
};

/**
 * Validation funciton
 */
Validator.lang = function lang() {
    return "en";
};

/**
 * Data function
 */
Validator.data = function data(req) {
    return {
        name: req.body.name,
        password: req.body.password,
    };
};

/**
 * Rules function
 */
Validator.rules = function rules() {
    return {
        name: "required|min:4|max:25",
        password: "required|min:6|max:50",
    };
};

/**
 * Messages function
 */
Validator.messages = function messages() {
    return {
        "min.password": "مقدار :attribute باید حداقل :min کاراکتر باشد.",
        "max.password": "مقدار :attribute باید حداکثر :max کاراکتر باشد.",
    };
};

/**
 * Return captions
 */
Validator.attributes = function attributes() {
    return {
        name: "نام کاربری",
        password: "گذرواژه",
    };
};
