/**
 * Package controller module
 * @const
 */
const Package = require('../models/package');

/**
 * Driver controller module
 * @const
 */
const Driver = require('../models/driver');

/**
 * Utility module
 * @const
 */
const Utility = require('../utility');

/**
 * express module
 * @const
 */
const express = require('express');

/**
 * Firestore service module
 * @requires firestore-service
 */
const fsService = require('../firestore-service');
const e = require('express');

/**
 * Utility instance
 * @const
 */
const util = new Utility();

// Export the package controller module
module.exports = {
    /**
     * Create a new package
     * @function
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {json} - a json response containing the package's package id and mongoDB id
     */
    createPackage: async function(req, res) {
        try {
            // create a new package object
            let aPackage = new Package({
                package_id: await assignPackageId(),
                package_title: req.body.package_title,
                package_weight: req.body.package_weight,
                package_destination: req.body.package_destination,
                description: req.body.description,
                createdAt: new Date(),
                isAllocated: req.body.isAllocated,
                driver_id: req.body.driver_id
            });

            // if the package is not created, return an error message and status code 400
            if(!aPackage){
                res.status(400).json({error: "Package not created"});
            }

            // save the package to the database
            await aPackage.save();

            // increment firestore create operation count
            fsService.incrementCreateOps();

            // find the driver by the driver mongoDB id given
            let driver = await Driver.findOne({ _id: req.body.driver_id });

            // push the package id to the driver's assigned_packages array
            driver.assigned_packages.push(aPackage._id);

            // save the updates to driver object
            await driver.save();
            
            // if successful, return the package's mongoDB id and package id in json format
            res.status(200).json({id: aPackage._id, package_id: aPackage.package_id});

        } catch (error) {
            // if there's an error, return the error message
            res.status(500).json({error: error.message});

        }
        
    },

    /**
     * Get all packages in the mongoDb database
     * @function
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {json} - a json response containing all the packages
     */
    getAll: async function(req, res) {
        // find all packages in the package mongoDB collection
        let packages = await Package.find({}).populate('driver_id');

        // increment firestore read operation count
        fsService.incrementReadOps();

        // return the packages in json format with status code 200 (successfull)
        res.status(200).json(packages);
    },

    /**
     * Delete a package by the package id (mongoDB id)
     * @function
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {json} - a success/fail message
     */
    deleteById: async function(req, res) {
        try {
            // find the package by the package id
            let result = await Package.findOne({_id: req.params.id});

            // if the package is not found, return an error message and status code 404
            if (!result) {
                res.status(404).json({
                    acknowledged: false,
                    deletedCount: 0
                });
            }

            // get the driver object assigned to the package
            let driver = await Driver.findOne({ _id: result.driver_id });

            // remove the package from the driver's assigned_packages array
            driver.assigned_packages.pull({ _id: req.params.id });

            // save the updates to the driver object
            await driver.save();

            // increment firestore update operation count
            fsService.incrementUpdateOps();

            // delete the package from the database
            let deletedPackage = await Package.deleteOne({ _id: req.params.id });

            // increment firestore delete operation count
            if (deletedPackage.deletedCount > 0) {
                fsService.incrementDeleteOps();
            }

            // return a success message and the number of packages deleted in json format
            res.status(200).json({
                acknowledged: true,
                deletedCount: deletedPackage.deletedCount
            });

        } catch (error) {
            // if any other error occurs return json acknowledgement object and status code 500
            res.status(500).json({ 
                acknowledged: false,
                deletedCount: 0
            });
        }
    },

    /**
     * Update the destination of package by the package id (mongoDB id)
     * @function
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {json} - a success/fail message
     */
    updatePackage: async function(req, res) {
        try {

            // find the package by the package mongoDB id and update the package
            let result = await Package.findOneAndUpdate(
              { _id: req.body._id },
              req.body,
              { new: true, runValidators: true } // returns the updated document and runs the validators
            );

            // increment firestore update operation count
            fsService.incrementUpdateOps();
            
            // if the package is not found, return an error message and status code 404
            if (!result) {
                return res.status(404).json({
                    status: "Package not found"
                });
            }

            // return a success message
            res.status(200).json({
                status: "Updated successfully"
            });

        } catch (error) {
            // if any other error occurs, return the error message
            console.log(error);
            res.status(500).json({status: "Update failed"});
        }
            
    }
};

/**
 * Assign a unique package ID to a new package
 * @function
 * @returns {string} - a unique package ID
 */
async function assignPackageId() {
    let check = true; // Set check to true (initialize)
    let newId = util.generatePackageId(); // Generate a new package ID
    
    // Check if the new package ID is unique in mongoDB database
    try {
        let aPackage = await Package.findOne({ package_id: newId });
        if (!aPackage) {
            check = true;
        } else {
            check = false;
        }
    } catch (err) {
        console.log(err);
    }

    // If the package ID is not unique, recursively call the function to generate a new package ID
    if (!check) {
        return assignPackageId();
    } else {
        return newId; // Return the new package ID if the package ID is unique
    }
}