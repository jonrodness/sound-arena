const express = require('express');
const router = express.Router();
const { 
    DuplicateCompetitionResultsError,
    finalizeCompetition,
    returnAbandonedTracks
} = require('../jobs/competition');

router.get('/finalize-competition', async (req, res, next) => {
    try {
        await finalizeCompetition(req, res);
    } catch(err) {
        if (err instanceof DuplicateCompetitionResultsError) {
            return res.status(406).send('Invalid request');
        }
        return res.status(500).end();
    }
});

router.get('/return-abandoned-tracks', async (req, res, next) => {
    try {
        await returnAbandonedTracks(req, res);
    } catch(err) {
        return res.status(500).send();
    }
});

module.exports = router;