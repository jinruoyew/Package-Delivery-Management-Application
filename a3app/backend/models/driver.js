/**
 * mongoose module
 * @const
 */
const mongoose = require('mongoose'); 

/**
 * Utility module 
 * @requires Utility
 */
const Utility = require('../utility');

const util = new Utility();

/**
 * Driver schema
 * Holds the structure of all attributes of a driver.
 * Uses Utility functions to validate the attributes.
 * 
 * driver_id - driver ID
 * driver_name - driver name
 * driver_department - driver department
 * driver_licence - driver licence number 
 * driver_isActive - driver isActive switch value
 * 
 */
const driverSchema = new mongoose.Schema({
    driver_id: {
        type: String
    },
    driver_name: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return value.length >= 3 && value.length <= 20 && util.isAlphabetic(value);
            },
            message: 'Driver name should be alphabetic, between 3 and 20 characters long'
        }
    },
    driver_department: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return value === "Food" || value === "Furniture" || value === "Electronic";
            },
            message: 'Driver department should be Food, Furniture or Electronic'
        }
    },
    driver_licence: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return value.length === 5 && util.isAlphanumeric(value);
            },
            message: 'Driver licence should be alphanumeric, 5 characters long'
        }
    },
    driver_isActive: {
        type: Boolean,
        required: true,
        validate: {
            validator: function(value) {
                return value === true || value === false;
            },
            message: 'Driver isActive should be true or false'
        }
    },
    driver_createdAt: {
        type: Date
    },
    assigned_packages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package'
    }]
}); 

// Export the Driver model for use in app.js and other files
module.exports = mongoose.model('Driver', driverSchema); 