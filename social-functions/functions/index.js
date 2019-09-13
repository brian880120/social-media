const express = require('express');
const app = express();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');

const config = {
    apiKey: "AIzaSyAQY96_9WYX4EKZNsnIN82BVMzwVAgC8so",
    authDomain: "social-app-2db1a.firebaseapp.com",
    databaseURL: "https://social-app-2db1a.firebaseio.com",
    projectId: "social-app-2db1a",
    storageBucket: "social-app-2db1a.appspot.com",
    messagingSenderId: "539933197308",
    appId: "1:539933197308:web:5b8a41e4da59d11fc36879"
};

admin.initializeApp();
firebase.initializeApp(config);

const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

app.get('/screams', (req, res) => {
    db.collection('screams').orderBy('createdAt', 'desc').get().then(data => {
        let screams = [];
        data.forEach(doc => {
            screams.push({
                screamId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt,
            });
        });
        return res.json(screams);
    }).catch(err => {
        console.log(err);
    });
});

app.post('/scream', (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString(),
    };

    db.collection('screams').add(newScream).then((doc) => {
        res.json({message: `document ${doc.id} created successfully`});
    }).catch(err => {
        res.status(500).json({error: 'something went wrong'});
        console.error(err);
    });
});

const isEmpty = (input) => {
    return input.trim() === ''
};

const isEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

// signup route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    let errors = {};

    if (isEmpty(newUser.email)) {
        errors.email = 'must not be empty';
    } else if (!isEmail(newUser.email)) {
        errors.email = 'Email must not be valid';
    }

    if (isEmpty(newUser.password)) {
        errors.password = 'Must not empty';
    }

    if (newUser.password !== newUser.confirmPassword) {
        errors.confirmPassword = 'password must match';
    }

    if (isEmpty(newUser.handle)) {
        errors.handle = 'Must not empty';
    }

    if (Object.keys(errors).length) {
        return res.status(400).json({errors});
    }

    db.doc(`/users/${newUser.handle}`).get().then(doc => {
        if (doc.exists) {
            return res.status(400).json({
                handle: 'this handle is already taken',
            });
        } else {
            return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
    }).then(data => {
        return {
            token: data.user.getIdToken(),
            userId: data.user.uid,
        };
    }).then(data => {
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId: data.userId,
        };
        db.doc(`/users/${newUser.handle}`).set(userCredentials);
        return data.token;
    }).then((token) => {
        return res.status(201).json({token});
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            error: err.code,
        });
    });
});

app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };

    let errors = {};

    if (isEmpty(user.email)) {
        errors.email = 'must not be empty';
    }

    if (isEmpty(user.password)) {
        errors.password = 'must not be empty';
    }

    if (Object.keys(errors).length) {
        return res.status(400).json({errors});
    }

    firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(data => {
        return data.user.getIdToken();
    }).then(token => {
        return res.json({token});
    }).catch(err => {
        console.error(err);
        if (err.code === 'auth/wrong-password') {
            return res.status(403).json({
                general: 'Wrong credentials, please try apgin',
            });
        } else {
            return res.status(500).json({
                error: err.code,
            });
        }
    });
});

exports.api = functions.https.onRequest(app);