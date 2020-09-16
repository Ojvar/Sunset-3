"use strict";

import ValidatorHelper from "@HELPERS/validator-helper";

/**
 * Validator
 */
function Validator() {}
export default Validator;

/**
 * Validate function
 */
Validator.validate = function validate(data) {
    Validator.inputData = data;

    return ValidatorHelper.validate(Validator);
};

/**
 * Validation funciton
 */
Validator.lang = function lang() {
    return "fa";
};

/**
 * Validation funciton
 */
Validator.data = function data() {
    return Validator.inputData;
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
