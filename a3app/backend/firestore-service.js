/**
 * firebase admin module
 * @const
 */
const admin = require("firebase-admin");

/**
 * Get a reference to the firestore private key
 * @const
 * @requires service-account.json
 */
const serviceAccount = require("./service-account-a2.json");

// Initialize the access to Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)

});

/**
 * Get a reference to the firestore database for access
 * @const
 */
const firestoreDb = admin.firestore()

/**
 * Collection name for CRUD operation counts
 * @const
 */
const countColName = 'A2-CRUD-counts';

/**
 * Document name for firestore C (Create) operation counts
 * @const
 */
const createDocName = 'Creates';

/**
 * Document name for firestore R (Read) operation counts
 * @const
 */
const readDocName = 'Reads';

/**
 * Document name for firestore U (Update) operation counts
 * @const
 */
const updateDocName = 'Updates';

/**
 * Document name for firestore D (Delete) operation counts
 * @const
 */
const deleteDocName = 'Deletes';

/**
 * Collection name for users of the application
 * @const
 */
const userColName = 'users';

/**
 * Function to initialize Firestore collection and documents.
 * This will create the collections and set the CRUD counts to 0 if they don't exist.
 */
async function initializeCRUDCounters() {
    try {
        // Check and create the "Creates" document if it doesn't exist
        const createDocRef = firestoreDb.collection(countColName).doc(createDocName);
        const createDoc = await createDocRef.get();
        if (!createDoc.exists) {
            await createDocRef.set({ count: 0 });
            console.log(`Created document: ${createDocName}, count = 0`);
        }

        // Check and create the "Reads" document if it doesn't exist
        const readDocRef = firestoreDb.collection(countColName).doc(readDocName);
        const readDoc = await readDocRef.get();
        if (!readDoc.exists) {
            await readDocRef.set({ count: 0 });
            console.log(`Created document: ${readDocName}, count = 0`);
        }

        // Check and create the "Updates" document if it doesn't exist
        const updateDocRef = firestoreDb.collection(countColName).doc(updateDocName);
        const updateDoc = await updateDocRef.get();
        if (!updateDoc.exists) {
            await updateDocRef.set({ count: 0 });
            console.log(`Created document: ${updateDocName}, count = 0`);
        }

        // Check and create the "Deletes" document if it doesn't exist
        const deleteDocRef = firestoreDb.collection(countColName).doc(deleteDocName);
        const deleteDoc = await deleteDocRef.get();
        if (!deleteDoc.exists) {
            await deleteDocRef.set({ count: 0 });
            console.log(`Created document: ${deleteDocName}, count = 0`);
        }

    } catch (error) {
        // Log error if any occurs during initialization
        console.error('Error initializing Firestore', error);
    }
}

// Initialize the Firestore CRUD counters
initializeCRUDCounters();

// Functions to increment and get firestore read, write, update and delete operation counts

/**
 * Function to increment firestore create operation count
 * @function
 */
async function incrementCreateOps() {
    // Get a reference to the "Creates" document
    const docRef = firestoreDb.collection(countColName).doc(createDocName);

    // Increment the count by 1
    await docRef.update({ count: admin.firestore.FieldValue.increment(1) });
}

/**
 * Function to increment firestore read operation count
 * @function
 */
async function incrementReadOps() {
    // Get a reference to the "Reads" document
    const docRef = firestoreDb.collection(countColName).doc(readDocName);

    // Increment the count by 1
    await docRef.update({ count: admin.firestore.FieldValue.increment(1) });
}

/**
 * Function to increment firestore update operation count
 * @function
 */
async function incrementUpdateOps() {
    // Get a reference to the "Updates" document
    const docRef = firestoreDb.collection(countColName).doc(updateDocName);

    // Increment the count by 1
    await docRef.update({ count: admin.firestore.FieldValue.increment(1) });
}

/**
 * Function to increment firestore delete operation count
 * @function
 */
async function incrementDeleteOps() {
    // Get a reference to the "Deletes" document
    const docRef = firestoreDb.collection(countColName).doc(deleteDocName);

    // Increment the count by 1
    await docRef.update({ count: admin.firestore.FieldValue.increment(1) });
}

/**
 * Function to get firestore create operation count
 * @function
 */
async function getCreateCount() {
    // Get a reference to the "Creates" document
    const docRef = firestoreDb.collection(countColName).doc(createDocName);

    // Get the document 
    const doc = await docRef.get();

    // Return the count value
    return doc.data().count;
}

/**
 * Function to get firestore read operation count
 * @function
 */
async function getReadCount() {
    // Get a reference to the "Reads" document
    const docRef = firestoreDb.collection(countColName).doc(readDocName);

    // Get the document
    const doc = await docRef.get();

    // Return the count value
    return doc.data().count;
}

/**
 * Function to get firestore update operation count
 * @function
 */
async function getUpdateCount() {
    // Get a reference to the "Updates" document
    const docRef = firestoreDb.collection(countColName).doc(updateDocName);

    // Get the document
    const doc = await docRef.get();

    // Return the count value
    return doc.data().count;
}

/**
 * Function to get firestore delete operation count
 * @function
 */
async function getDeleteCount() {
    // Get a reference to the "Deletes" document
    const docRef = firestoreDb.collection(countColName).doc(deleteDocName);

    // Get the document
    const doc = await docRef.get();

    // Return the count value
    return doc.data().count;
}

/**
 * Check if the user exists in the database by finding a document 
 * with the given username and password
 * @param {string} username 
 * @param {string} password 
 * @returns {boolean} true if the user exists, false otherwise
 */
async function checkLogin(username, password) {
    try {
        // Check if the user exists in the database
        const aUser = await firestoreDb
          .collection(userColName)
          .where("username", "==", username)
          .where("password", "==", password)
          .get();
        
        // Check if any documents were found with the given credentials
        if (aUser.empty) {
            return false;
        } else {
            return true;
        }

    } catch (error) {
        // Return false in case of an error
        return false; 
    }
}

/**
 * Create a new user in the database with the given username and password
 * if the username and password are valid and the user doesn't already exist
 * @function
 * @param {string} username 
 * @param {string} password 
 * @returns {boolean} true if the user is created, false otherwise
 */
async function createUser(username, password) {
    try {
        // Check if the user already exists in the database
        const aUser = await firestoreDb
          .collection(userColName)
          .where("username", "==", username)
          .get();

        // Return false if the user already exists in the database
        if (!aUser.empty) {
            return false;
        }

        // Add a new document with a generated ID
        await firestoreDb.collection(userColName).doc().set({
            username: username,
            password: password
        });

        return true;
    } catch (error) {
        // Return false in case of an error
        return false;
    }
}

// Export the functions for use in other modules
module.exports = {
    incrementCreateOps,
    incrementReadOps,
    incrementUpdateOps,
    incrementDeleteOps,
    getCreateCount,
    getReadCount,
    getUpdateCount,
    getDeleteCount,
    checkLogin,
    createUser
};