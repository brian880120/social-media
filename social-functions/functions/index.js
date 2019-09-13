const express = require('express');
const app = express();
const functions = require('firebase-functions');
const firebase = require('firebase');
const { config } = require('./util/config');

firebase.initializeApp(config);

const { signup, login, uploadImage } = require('./handlers/users');
const { getAllScreams, createScream } = require('./handlers/screams');
const { auth } = require('./util/firebaseAuth');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

app.get('/screams', getAllScreams);
app.post('/scream', auth, createScream);

// signup route
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', auth, uploadImage);

exports.api = functions.https.onRequest(app);