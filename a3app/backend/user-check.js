/**
 * express module
 * @const
 */
const express = require('express');

/**
 * Global variable to check if user is logined or not
 * @type {boolean}
 */
let loginStatus = false;

/**
 * Check if the user is logined or not
 * @function
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.next} next 
 */
function checkLoginStatus(req, res, next) {
    // Check if the user is logined
    if (!loginStatus) {
        // Redirect to the login page if the user is not logined
        res.redirect('/33343276/JinRuo/users/login');
    } else {
        // Continue to the next middleware if the user is logined
        next();
    }
}

/**
 * Check if the user is logined or not for API endpoints
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.next} next
 */
function checkLoginStatusAPI(req, res, next) {
    // Check if the user is logined
    if (!loginStatus) {
        // Send a message if the user is not logined
        res.send({ status: 'Not logined. Please login to access!' });
    } else {
        // Continue to the next middleware if the user is logined
        next();
    }
}

function getLoginStatus() {
    return loginStatus;
}

/**
 * Set the login status to true or false
 * @function
 * @param {boolean} status 
 */
function setLoginStatus(status) {
    loginStatus = status;
}

// Export the functions
module.exports = {
    checkLoginStatus,
    checkLoginStatusAPI,
    getLoginStatus,
    setLoginStatus
};
