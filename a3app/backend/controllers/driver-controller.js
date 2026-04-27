/**
 * Driver controller module
 * @const
 */
const Driver = require('../models/driver');

/**
 * Package controller module
 * @const
 */
const Package = require('../models/package');

/**
 * Utility module
 * @const
 */
const Utility = require('../utility');

/**
 * Firestore service module
 * @requires firestore-service
 */
const fsService = require('../firestore-service');

/**
 * express module
 * @const
 */
const express = require('express');
const e = require('express');

/**
 * Utility instance
 * @const
 */
const util = new Utility();

// Export the driver controller module
module.exports = {
    /**
     * Create a new driver
     * @function
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {json} - a json response containing the driver's driver id and mongoDB id
     */
    createDriver: async function(req, res) {
        try {
            console.log("Request body:", req.body); 
            // create a new driver object
            let aDriver = new Driver({
                driver_id: await assignDriverId(),
                driver_name: req.body.driver_name,
                driver_department: util.capitalize(req.body.driver_department),
                driver_licence: req.body.driver_licence,
                driver_isActive: req.body.driver_isActive,
                driver_createdAt: new Date()
            });
            
            // if the driver is not created, return an error message and status code 400
            if(!aDriver){
                return res.status(400).json({error: "Driver not created"});
            }

            // save the driver to the database
            await aDriver.save();

            // increment firestore create operation count
            fsService.incrementCreateOps();

            // if successful, return the driver's driver id and mongoDB id in json format
            res.status(200).json({id: aDriver._id, driver_id: aDriver.driver_id}); 

        } catch (error) {
            // if there's an error, return the error message
            res.status(500).json({error: error.message});

        }

    },

    /**
     * Get all drivers in the mongoDB driver collection
     * @function
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {json} - all drivers in the driver collection
     */
    getAll: async function(req, res) {
        // find all drivers in the driver mongoDB collection
        let drivers = await Driver.find({}).populate('assigned_packages');

        // increment firestore read operation count
        fsService.incrementReadOps();

        // return the drivers in json format
        res.status(200).json(drivers); 
    },

    /**
     * Delete a driver by the driver id (mongoDB id)
     * @function
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {json} - a success/fail message
     */
    deleteById: async function(req, res) {
        try {
            // find the driver by the driver id
            let result = await Driver.findOne({_id: req.query.driver_id});

            // if the driver is not found, return an error message and status code 404
            if (!result) {
                res.status(404).json({
                    acknowledged: false,
                    deletedCount: 0
                });
            }

            // get all the packages assigned to the driver
            let packages = result.assigned_packages;

            // find and remove all the packages assigned to the driver
            if (packages.length > 0) {
                for (let i = 0; i < packages.length; i++) {
                    await Package.deleteOne({_id: packages[i]});
                }
            }

            // delete the driver from the database
            result = await Driver.deleteOne({_id: req.query.driver_id});

            // increment firestore delete operation count
            if (result.deletedCount > 0) {
                fsService.incrementDeleteOps();
            }

            // return a success message
            res.status(200).json({
                acknowledged: true,
                deletedCount: result.deletedCount
            });

        } catch (error) {
            // if any other error occurs
            res.status(500).json({
                acknowledged: false,
                deletedCount: 0,
            });
        }
    },

    /**
     * Update the driver's department and licence by the driver id (mongoDB id)
     * @function
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {json} - a success/fail message
     */
    updateDriver: async function(req, res) {
        try {
            // find the driver by the driver mongoDB id and update the driver
            let driver = await Driver.findOneAndUpdate(
              { _id: req.body._id },
              {
                driver_department: util.capitalize(req.body.driver_department),
                driver_licence: req.body.driver_licence
              },
              { new: true, runValidators: true }
            );

            // if the driver is not found, return an error message and status code 404
            if (!driver) {
                return res.status(404).json({
                    status: "Id not found"
                });
            }

            // increment firestore update operation count
            fsService.incrementUpdateOps();

            // return a success message
            res.status(200).json({
                status: "Driver updated successfully"
            });
        } catch (error) {
            // if any other error occurs
            res.status(400).json({
                status: "Driver update failed",
                message: error.message
            });
        }
    },
    getAssignedPackages: async function(req, res) {
        try {
        
            // find the driver by the driver mongoDB id
            let driver = await Driver.findOne({ _id: req.params.id }).populate('assigned_packages');

            // if the driver is not found, return an error message and status code 404
            if (!driver) {
                return res.status(404).json({
                    status: "Driver not found"
                });
            }

            // increment firestore read operation count
            fsService.incrementReadOps();

            // return the assigned packages in json format
            res.status(200).json(driver.assigned_packages);

        } catch (error) {
            // if any other error occurs
            res.status(500).json({
                status: "Failed to get assigned packages",
                message: error.message
            });
        }
    }
};

/**
 * Assign a unique driver ID to a new driver
 * @function
 * @returns {string} - a unique driver ID
 */
async function assignDriverId() {
    let check = true; // Set check to true (initialize)
    let newId = util.generateDriverId(); // Generate a new driver ID
    
    // Check if the new driver ID is unique in mongoDB database
    try {
        let driver = await Driver.findOne({ driver_id: newId });
        if (!driver) {
            check = true;
        } else {
            check = false;
        }
    } catch (err) {
        console.log(err);
    }
    
    // If the driver ID is not unique, recursively call the function to generate a new driver ID
    if (!check) {
        return assignDriverId();
    } else {
        return newId; // Return the new driver ID if the driver ID is unique
    }

}