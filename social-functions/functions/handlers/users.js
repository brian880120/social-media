const { db, admin } = require('../util/admin');
const { config } = require('../util/config');
const firebase = require('firebase');
const { validateSignupData, validateLoginData } = require('../util/validator');

const signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    const { valid, errors } = validateSignupData(newUser);

    if (!valid) {
        return res.status(400).json(errors);
    }

    const noImage = 'placeholder.png';

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
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImage}?alt=media`,
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
};

const login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };

    const { valid, errors } = validateLoginData(user);

    if (!valid) {
        return res.status(400).json(errors);
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
};

const uploadImage = (req, res) => {
    const Busboy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new Busboy({headers: req.headers});


    let imageFilename;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/jpeg' && mimetype != 'image/png') {
            return res.status(400).json({error: 'Wrong file type submitted'});
        }
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFilename = `${Math.round(Math.random() * 10000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFilename);
        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype,
                },
            },
        }).then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFilename}?alt=media`;
            return db.doc(`/users/${req.user.handle}`).update({
                imageUrl: imageUrl,
            }).then(() => {
                return res.json({message: 'Image uploaded successfully'});
            }).catch(err => {
                console.error(err);
                return res.status(500).json({error: err.code});
            });
        });
    });

    busboy.end(req.rawBody);
};

module.exports = { signup, login, uploadImage };
