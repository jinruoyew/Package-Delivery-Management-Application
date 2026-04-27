/**
 * mongoose module
 * @const
 */
const mongoose = require('mongoose'); 

/**
 * Driver module
 * @requires Driver
 */
const Driver = require('./driver');

/**
 * Utility module 
 * @requires Utility
 */
const Utility = require('../utility');

const util = new Utility();

/**
 * Package schema
 * Holds the structure of all attributes of a package.
 * Uses Utility functions to validate the attributes.
 * 
 * package_id - package ID
 * package_title - package title
 * package_weight - package weight
 * package_destination - package destination
 * description - package description
 * createdAt - package creation date
 * isAllocated - package allocation switch value
 * driver_id - driver ID to whom the package is allocated
 * 
 */
const packageSchema = new mongoose.Schema({
    package_id: {
        type: String
    },
    package_title: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return value.length >= 3 && value.length <= 15 && util.isAlphanumeric(value);
            },
            message: 'Package title should be alphanumeric, between 3 and 15 characters long'
        }
    },
    package_weight: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value > 0;
            },
            message: 'Package weight should be greater than 0'
        }
    },
    package_destination: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return value.length >= 5 && value.length <= 15 && util.isAlphanumeric(value);
            },
            message: 'Package destination should be alphanumeric, between 5 and 15 characters long'
        }
    },
    description: {
        type: String,
        validate: {
            validator: function(value) {
                return value.length >= 0 && value.length <= 30;
            },
            message: 'Description should be alphabetic, between 3 and 20 characters long'
        }
    },
    createdAt: {
        type: Date
    },
    isAllocated: {
        type: Boolean,
        required: true,
        validate: {
            validator: function(value) {
                return value === true || value === false;
            },
            message: 'isAllocated should be a boolean value'
        }
    },
    driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true,
        validate: {
            validator: async function(value) {
                try {
                    const driver = await Driver.findOne({ _id: value });
                    return driver !== null;  // Return false if no driver with this ID exists
                } catch (err) {
                    return false;  // In case of any error, return false to indicate invalidity
                }
            },
            message: 'Driver ID should be of an existing driver'
        }
    }
});

// Export the package schema to use in app.js and other files
module.exports = mongoose.model('Package', packageSchema);