const { db } = require('../util/admin');

const getAllScreams = (req, res) => {
    db.collection('screams').orderBy('createdAt', 'desc').get().then(data => {
        let screams = [];
        data.forEach(doc => {
            screams.push({
                screamId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt,
                commentCount: doc.data().commentCount,
                likeCount: doc.data().likeCount,
            });
        });
        return res.json(screams);
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err.code});
    });
};

const createScream = (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString(),
    };
    
    db.collection('screams').add(newScream).then((doc) => {
        res.json({message: `document ${doc.id} created successfully`});
    }).catch(err => {
        res.status(500).json({error: 'something went wrong'});
        console.error(err);
    });
};

module.exports = { getAllScreams, createScream };
