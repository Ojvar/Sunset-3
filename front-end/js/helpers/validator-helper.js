"use strict";

const ValidatorJS = require("validatorjs");

/**
 * Validator
 */
function Validator() {}
export default Validator;

/**
 * Validate
 * @param {Object} customValidator customValidatort
 */
Validator.validate = function validate(customValidator) {
    let data = {};
    let rules = {};
    let messages = {};
    let attributes = {};
    let lang = "en";

    /* Preparation */
    if (customValidator.data) {
        data = customValidator.data();
    }

    if (customValidator.rules) {
        rules = customValidator.rules(data);
    }

    if (customValidator.messages) {
        messages = customValidator.messages(data);
    }

    if (customValidator.attributes) {
        attributes = customValidator.attributes(data);
    }

    /* Setup language */
    if (null != customValidator.lang) {
        lang = customValidator.lang(data);
    }
    ValidatorJS.useLang(lang);

    /* Make a new instance */
    const validator = new ValidatorJS(data, rules, messages);

    /* Set attribute name */
    const attributeNames = {};
    Object.keys(attributes).forEach(
        (key) => (attributeNames[key] = attributes[key])
    );
    validator.setAttributeNames(attributes);

    /* Validate */
    const passes = validator.passes();

    return {
        success: passes,
        data: {
            validator,
            errors: Validator.generateErrors(validator),
        },
    };
};

/**
 * Generate errors list
 */
Validator.generateErrors = function generateErrors(validator) {
    const allErrors = validator.errors.all();

    /* All errors */
    const errors = [];
    Object.keys(allErrors).forEach((key) => {
        errors.push(allErrors[key].join("\n"));
    });

    return errors.join("\n");
};
