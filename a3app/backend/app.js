/**
 * Main application of Package Delivery Management Application (PDMA)
 * @author Jin Ruo Yew
 */

/**
 * express module
 * @const
 */
const express = require('express');

/**
 * mongoose module
 * @const
 */
const mongoose = require('mongoose');

/**
 * path module
 * @const
 */

const path = require('path');

/**
 * Driver module
 * @requires Driver
 */
const Driver = require('./models/driver');

/**
 * Package module
 * @requires Package
 */
const Package = require('./models/package');

/**
 * Utility module 
 * @requires Utility
 */
const Utility = require('./utility');

/**
 * fs module
 * @const
 */
const fs = require("fs");

/**
 * Firestore service module
 * @requires firestore-service
 */
const fsService = require('./firestore-service');

/**
 * Socket.io module
 * @const
 */
const {Server} = require('socket.io');

/**
 * http module
 * @const
 */
const http = require('http');

/**
 * Translate module
 * @const
 */
const { Translate } = require('@google-cloud/translate').v2;

/**
 * Text to speech module
 * @const
 */
const textToSpeech = require("@google-cloud/text-to-speech");

// Create a new textToSpeech client
const client = new textToSpeech.TextToSpeechClient();

/**
 * Google Generative AI module
 * @const
 */
const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Google API key for the Generative AI module
 * @const
 */
const gemini_api_key = "AIzaSyBA13VTJ-OzaDjjuNnpYpCjkxgPCUpr9oY";

/**
 * Google Generative AI instance
 * @const
 */
const googleAI = new GoogleGenerativeAI(gemini_api_key);

/**
 * Gemini configuration for the Generative AI module
 * @const
 */
const geminiConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 4096,
};

/**
 * Generative model for the Generative AI module
 * @const
 */
const geminiModel = googleAI.getGenerativeModel({
    model: "gemini-pro",
    geminiConfig,
});

/**
 * cors module
 * @const
 */
const cors = require('cors');

/**
 * User check module
 * @requires user-check
 */
const { checkLoginStatus, setLoginStatus, getLoginStatus} = require('./user-check');

/**
 * Port number
 * @const
 */
const PORT_NUMBER = 8080;

/**
 * App instance
 * @const
 */
const app = express(); 

/**
 * Server instance
 * @const
 */
const server = http.createServer(app);

const VM_EXTERNAL_IP = "34.129.149.209";

/**
 * Socket.io instance
 * @const
 */
const io = new Server(server, {
    cors: {
        origin: "http://"+VM_EXTERNAL_IP, // Update with your Angular app's origin
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
      }
});
//const io = new Server(server); //for local testing purposes

/**
 * Io connection events for socket.io
 * @function
 */
io.on('connection', (socket) => {

    // Listen for the event for translating a package description
    socket.on('translateDescription', (data) => {
        // Get the data from the client side
		text = data.text;
		targetLanguage = data.targetLanguage;

		// Instantiate a client for the Google Cloud Translation API
        const translate = new Translate();

        translate.translate(text, targetLanguage)
            .then(results => {
                const translation = results[1].data.translations[0].translatedText; 
                io.emit("translatedDescription", { text: text, targetLanguage: targetLanguage, translation: translation });
            })
            .catch(error => {
                console.error("ERROR:", error);
                socket.emit("translationError", { message: "Translation failed. Please try again." });
            });
    });

    socket.on('text2Speech', (data) => {
        // The text to synthesize
        const text = data.text;
        const id = data.id;

        // Construct the request
        const request = {
            input: { text: text },
            // Select the language and SSML Voice Gender (optional)
            voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
            // Select the type of audio encoding
            audioConfig: { audioEncoding: "MP3" },
        };
        
        // Performs the Text-to-Speech request
        client.synthesizeSpeech(request, (err, response) => {
            if (err) {
                console.error("ERROR:", err);
                socket.emit("text2SpeechError", { message: "Text-to-speech failed. Please try again." });
                return;
            }
        
            // Write the binary audio content to a local file
            const outputFilePath = "public/" + `audio/output_${id}${socket.id}.mp3`;
            fs.writeFile(outputFilePath, response.audioContent, "binary", err => {
                if (err) {
                    console.error("ERROR:", err);
                    return;
                }
                console.log("Audio content written to file:" + outputFilePath);
                io.emit("text2SpeechComplete", { path: outputFilePath});
            });
        });
    });

    socket.on('distanceCalculation', async (data) => {
        // Get the data from the client side
		destination = data.destination;

		// Get the generative content from the Google Generative AI module
        const result = await geminiModel.generateContent(`What is the distance between ${destination} and Melbourne?`);
        
        // Send the generative content to the client side
        io.emit("distanceCalculated", { result: result });
    });



});

/**
 * Utility class instance
 * @const
 */
const util = new Utility(); 

const url = 'mongodb://localhost:27017/assignment3';

/**
 * function to connect to MongDB database
 * @function
 */
async function connectDB() {
    await mongoose.connect(url);
    console.log('Connected to database');
};

// Connect to MongoDB database
connectDB(url).then(console.log).catch(console.error);

/**
 * Router for driver RESTful API endpoints
 * @const
 */
const driverRouter = require('./routes/driver-routes');

/**
 * Router for package RESTful API endpoints
 * @const
 */
const packageRouter = require('./routes/package-routes');
const { Socket } = require('dgram');

app.use(express.urlencoded({ extended: true })); //need this to tell app to parse body of request

// Use the express.json() middleware function to parse json data in the body of the request
app.use(express.json()); 

//use multiple static assets directories, call the express.static middleware function multiple times
app.use(express.static("node_modules/bootstrap/dist/css")) //specify folder before use
app.use(express.static("files")) //specify location of static images

//serve the static files in the dist folder
app.use(express.static('./dist/a3app/browser'));
app.use('/public/audio', express.static(path.join(__dirname, '../public/audio')));

// RESTful API endpoints for Assignment 2 for drivers and packages
app.use('/33343276/JinRuo/api/v1/drivers', driverRouter);
app.use('/33343276/JinRuo/api/v1/packages', packageRouter);

// Use the cors middleware function to allow cross-origin requests
app.use(cors());

/**
 * API route to return the CRUD count of the application
 * @name get/33343276/JinRuo/stats
 * @function
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 */
app.get("/33343276/JinRuo/api/v1/stats", async function(req, res) {
    // Get the create, read, update, and delete counts from firestore
    let creates = await fsService.getCreateCount();
    let reads = await fsService.getReadCount();
    let updates = await fsService.getUpdateCount();
    let deletes = await fsService.getDeleteCount();

    // Send the counts in json format
    res.send({creates: creates, reads: reads, updates: updates, deletes: deletes});
});

/**
 * API route to check if user is authenticated
 * @name get/33343276/JinRuo/api/v1/users/auth
 * @function
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 */
app.get('/33343276/JinRuo/api/v1/users/auth*', (req, res) => {
    console.log(getLoginStatus());
    res.send(getLoginStatus());
});

/**
 * API route to login user and set login status to true if 
 * the username and password exist in the firestore database
 * @name post/33343276/JinRuo/api/v1/users/login
 * @function
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 */
app.post("/33343276/JinRuo/api/v1/users/login", async function(req, res) {
    // Obtain the username and password from the request body
    let username = req.body.username;
    let password = req.body.password;

    // Check if the username and password exist in the database
    if (await fsService.checkLogin(username, password)) {
        // Set the login status to true
        setLoginStatus(true);

        // Send status message for successful login
        res.send({status: true});

    } else {
        // Send status message for failed login
        res.send({status: false});
    }
});

/**
 * API route to add a user to the firestore database
 * Add a user to the firestore database (if valid) and send a status message
 * @name post/33343276/JinRuo/api/v1/users/signup
 * @function
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 */
app.post("/33343276/JinRuo/api/v1/users/signup", async function(req, res) {
    // Obtain the username and password from the request body
    let username = req.body.username;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;

    // Check if the username and password are valid
    if (username.length >= 6 && util.isAlphanumeric(username) && 
        password.length >= 5 && password.length <= 10 && password === confirmPassword) {
        
        // Add the user to the firestore database
        let result = await fsService.createUser(username, password);

        if(!result) {
            // Status message for failed signup
            res.send({status: false});
        } else {
            // Status message for successful signup
            res.send({status: true});
        }

    } else {
        // Send status message for failed signup
        res.send({status: false});
    }
});

/**
 * Configure the port number
 * @name listen
 * @function
 * @param {int} PORT_NUMBER - Express port number
 * @param {function} callback - Express callback
 */
server.listen(PORT_NUMBER, function() {
    console.log(`Server is running on ${PORT_NUMBER}`);
});