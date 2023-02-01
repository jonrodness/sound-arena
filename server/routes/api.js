const express = require('express');

const router = express.Router();
const competitionController = require('../controllers/CompetitionController');
const userController = require('../controllers/UserController');
const { validateUserProfileInput } = require('../controllers/UserController/validations');
const chartController = require('../controllers/ChartController');
const trackController = require('../controllers/TrackController');
const {
  validateAwardVersion0,
  validateAwardVersion1,
} = require('../controllers/TrackController/validations');
const { deleteUserLinkValidation } = require('../controllers/UserControllerValidation');
const { addCompetitionToReq, checkForceReset } = require('../middlewares/competition');
const { verifyAuthToken, addUserToReq } = require('../auth');

/// ////////////////////////
/* CompetitionController */
/// ////////////////////////
router.get('/auth/competition', competitionController.getCompetitionState);
router.get(
  '/auth/competition/tracks',
  addCompetitionToReq,
  checkForceReset,
  competitionController.getMatchupTrack,
);

router.put(
  '/auth/competition/tracks',
  addCompetitionToReq,
  checkForceReset,
  competitionController.setTrackIsPlayed,
);

router.put(
  '/auth/competition/tracks/winner',
  addCompetitionToReq,
  checkForceReset,
  competitionController.setWinner,
);

router.get('/auth/competition/cancel-matchup', competitionController.cancelMatchup);

/// /////////////////
/* UserController */
/// /////////////////
router.get('/user/:userId', userController.getUserDetails);
router.get('/auth/my-profile', userController.getMyProfile);
router.put('/auth/my-profile', validateUserProfileInput, userController.updateMyProfile);
router.get('/user/:userId/tracks', userController.getUserTracks);
router.get('/auth/my-tracks', userController.getMyTracks);
router.post(
  '/auth/liked-tracks',
  userController.validateTrackIdInput,
  userController.likeTrack,
);
router.get('/auth/liked-tracks', userController.getLikedTracks);
router.delete(
  '/auth/liked-tracks/:trackId',
  userController.validateTrackIdInput,
  userController.unlikeTrack,
);
router.get('/auth/new-awards', userController.getMyNewAwards);
router.get('/auth/competition-notifications', userController.getMyCompetitionNotifications);

/* User Links */
router.get('/user/:userId/links', userController.getUserLinks);
router.get('/auth/my-links', userController.getUserLinks);
router.post('/auth/user-link', userController.addUserLink);
router.delete(
  '/auth/user-link',
  deleteUserLinkValidation,
  userController.deleteUserLink,
);
router.put('/auth/track/:trackId/notifications/ack', userController.setTrackNotificationsAcknowledged);

/// //////////////////
/* ChartController */
/// //////////////////
router.get('/chart', chartController.getCompetitionResults);

/// //////////////////
/* TrackController */
/// //////////////////
router.post('/auth/track', trackController.addTrack);
router.delete('/auth/track/:trackId', trackController.deleteTrack);

// Disabled:
router.get('/auth/track/:trackId/score', trackController.getTrackScore);

router.get('/auth/track/:trackId/status', trackController.getTrackStatus);
router.get('/track/:trackId', trackController.getTrackDetails);
router.get('/auth/track/:trackId/awards', trackController.getTrackAwards);

/* Track Links */
router.get('/track/:trackId/links', trackController.getTrackLinks);
router.post('/auth/track/:trackId/link', trackController.addTrackLink);
router.delete('/auth/track/link/:linkId', trackController.deleteTrackLink);
router.get(
  '/award',
  validateAwardVersion0,
  validateAwardVersion1,
  trackController.getTrackAward,
);
router.put('/auth/track/:trackId/awards/ack', trackController.setTrackAwardsAcknowledged);

/// //////////////////////////
/* ConfigurationController */
/// //////////////////////////
// router.get('/conf/linkTypes', configurationController.getLinkTypes); // Do not expose - not being used by FE

/// //////////////////////////
/* Account */
/// //////////////////////////
router.get(
  '/auth/register',
  verifyAuthToken,
  addUserToReq,
  (_, res) => res.status(200).send({ registered: true }),
);

/// //////////////////////////
/* Healthchecks */
/// //////////////////////////
router.get(
  '/ping',
  (_, res) => {
    res.status(200).send('pong');
  },
);

module.exports = router;
