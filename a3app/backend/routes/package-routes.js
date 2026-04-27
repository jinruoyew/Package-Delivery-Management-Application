/**
 * express module
 * @const
 */
const express = require('express');

/**
 * package controller module
 * @const
 */
const packageCont = require('../controllers/package-controller');

/**
 * user-check module
 * @const
 */
const {checkLoginStatusAPI} = require('../user-check');

/**
 * express router
 * @const
 */
const router = express.Router();

/**
 * Post request to add a new package
 * @name post/33343276/JinRuo/api/v1/packages/add
 * @function
 * @param {string} path - Express path
 * @param {callback} checkLoginStatusAPI - Express middleware to check if user is logged in
 * @param {function} callback - Express callback
 */
router.post('/add', packageCont.createPackage);
// remove check for login status first

/**
 * Get request to get all packages
 * @name get/33343276/JinRuo/api/v1/packages
 * @function
 * @param {string} path - Express path
 * @param {callback} checkLoginStatusAPI - Express middleware to check if user is logged in
 * @param {function} callback - Express callback
 */
router.get('/', packageCont.getAll);
// remove check for login status first

/**
 * Delete request to delete a package by id given in route parameter
 * @name delete/33343276/JinRuo/api/v1/packages/delete/:id
 * @function
 * @param {string} path - Express path
 * @param {callback} checkLoginStatusAPI - Express middleware to check if user is logged in
 * @param {function} callback - Express callback
 */
router.delete('/delete/:id', packageCont.deleteById);
// remove check for login status first

/**
 * Put request to update a package
 * @name put/33343276/JinRuo/api/v1/packages/update
 * @function
 * @param {string} path - Express path
 * @param {callback} checkLoginStatusAPI - Express middleware to check if user is logged in
 * @param {function} callback - Express callback
 */
router.put('/update', packageCont.updatePackage);
// remove check for login status first

// Export the router module
module.exports = router;