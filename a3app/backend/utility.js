/**
 * Utility class for generating IDs and checking input validity
 * @constructor
 */
class Utility{
    
    /**
     * Generates a random driver ID
     * @returns {string} - A randomly generated driver ID
     */
    generateDriverId() {
        let ret = "D";
        ret += this.getRandInt(9) + this.getRandInt(9) + "-"
        ret += "33-" + this.getRandUppercaseLetter() + this.getRandUppercaseLetter() + this.getRandUppercaseLetter();
        return ret;
    }

    /**
     * Generates a random package ID
     * @returns {string} - A randomly generated package ID
     */
    generatePackageId() {
        let ret = "P";
        ret += this.getRandUppercaseLetter() + this.getRandUppercaseLetter() + "-";
        ret += "JY-" + this.getRandInt(9) + this.getRandInt(9) + this.getRandInt(9);
        return ret
    }

    /**
     * Randomly generates an uppercase letter
     * @returns {string} - A randomly generated alphabetical string
     */
    getRandUppercaseLetter() {
        // Random number between 65 and 90 -> 'A' to 'Z' in ASCII
        const randomCharCode = Math.floor(Math.random() * 26) + 65;
        return String.fromCharCode(randomCharCode);
    }

    /**
     * Generates a random number in string format
     * @param {int} max - The maximum number to be generated
     * @returns {string} - A randomly generated number in string format
     */
    getRandInt(max) {
        return Math.floor(Math.random() * max).toString(); // Random number returned in string format
    }

    /**
     * Check if the input string length is exactly the same as the given value
     * @param {string} str - The input string to be checked
     * @param {int} val - The value to be compared with the input string length
     * @returns {boolean} - True if the input string length is the same as the given value, false otherwise
     */
    checkLengthExact(str, val) {
        return str.length == val;
    }

    /**
     * Check if the input string length is within the given range
     * @param {string} str - The input string to be checked
     * @param {int} min - The minimum length of the string
     * @param {max} max - The maximum length of the string
     * @returns {boolean} - True if the input string length is within the given range, false otherwise
     */
    checkLengthMinMax(str, min, max) {
        return (str.length >= min) && (str.length <= max);
    }

    /**
     * Checks if the input string is alphabetic
     * @param {string} str - The input string to be checked
     * @returns {boolean} - True if the input string is alphabetic, false otherwise
     */
    isAlphabetic(str) {
        return /^[A-Za-z\s]+$/.test(str);
    }

    /**
     * Checks if the input string is alphanumeric
     * @param {string} str - The input string to be checked
     * @returns {boolean} - True if the input string is alphanumeric, false otherwise
     */
    isAlphanumeric(str) {
        return /^[A-Za-z0-9\s]+$/.test(str);
    }

    /**
     * Converts the string value of a switch input to a boolean value
     * @param {string} str - The value of a switch input
     * @returns {boolean} - True if the input string is "on", false otherwise
     */
    convertSwitchValBoolean(str) {
        switch(str) {
            case "on":
                return true;
            default:
                return false;
        }
    }

    /**
     * Capitalizes the first letter of a string and converts the rest to lowercase
     * @param {string} str - input string
     * @returns {string} - string with first letter capitalized and the rest lowercase
     */
    capitalize(str) {
        if (str.length === 0) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

}

module.exports = Utility; // Export the Utility class for external use