"use strict";

const Mongoose = require("mongoose");

/**
 * Model class
 */
function Model() {}
module.exports = Model;

/**
 * Initialize model
 */
Model.init = function init() {
    const modelName = "User";

    return new Promise((resolve, reject) => {
        const model = Mongoose.model(modelName, Model.getSchema());

        resolve({
            name: modelName,
            model,
        });
    });
};

/**
 * Model schema
 */
Model.getSchema = function getSchema() {
    return new Mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
                unique: true,
                index: true,
                trim: true,
            },
            email: {
                type: String,
                required: true,
                unique: true,
                index: true,
                trim: true,
            },
            pwd: {
                type: String,
                required: true,
            },
            activated_at: {
                type: Date,
                default: null,
            },
            activation_code: {
                type: String,
                default: null,
            },
            roles: [
                {
                    type: Mongoose.Schema.Types.ObjectId,
                    ref: "Role",
                },
            ],
        },
        {
            timestamps: {
                createdAt: "created_at",
                updatedAt: "updated_at",
            },
        }
    );
};
