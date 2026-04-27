/**
 * express module
 * @const
 */
const express = require('express');

/**
 * driver controller module
 * @const
 */
const driverCont = require('../controllers/driver-controller');

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
 * Post request to add a new driver
 * @name post/33343276/JinRuo/api/v1/drivers/add
 * @function
 * @param {string} path - Express path
 * @param {callback} checkLoginStatusAPI - Express middleware to check if user is logged in
 * @param {function} callback - Express callback
 */
router.post('/add', driverCont.createDriver);
// remove check for login status first

/**
 * Get request to get all drivers
 * @name get/33343276/JinRuo/api/v1/drivers
 * @function
 * @param {string} path - Express path
 * @param {callback} checkLoginStatusAPI - Express middleware to check if user is logged in
 * @param {function} callback - Express callback
 */
router.get('/', driverCont.getAll);
// remove check for login status first

/**
 * Delete request to delete a driver by id
 * @name delete/33343276/JinRuo/api/v1/drivers/delete
 * @function
 * @param {string} path - Express path
 * @param {callback} checkLoginStatusAPI - Express middleware to check if user is logged in
 * @param {function} callback - Express callback
 */
router.delete('/delete', driverCont.deleteById);
// remove check for login status first

/**
 * Put request to update a driver
 * @name put/33343276/JinRuo/api/v1/drivers/update
 * @function
 * @param {string} path - Express path
 * @param {callback} checkLoginStatusAPI - Express middleware to check if user is logged in
 * @param {function} callback - Express callback
 */
router.put('/update', driverCont.updateDriver);
// remove check for login status first

/**
 * Get request to get all packages assigned to a driver
 * @name get/33343276/JinRuo/api/v1/drivers/assignedPackages/:id
 * @function
 * @param {string} path - Express path
 * @param {callback} checkLoginStatusAPI - Express middleware to check if user is logged in
 * @param {function} callback - Express callback
 */
router.get('/assignedPackages/:id', driverCont.getAssignedPackages);
// remove check for login status first

// Export the driver routes module
module.exports = router;