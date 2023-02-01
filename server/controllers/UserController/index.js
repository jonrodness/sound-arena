/**
 * UserController
 */

const userQueries = require('../../db/user');
const trackQueries = require('../../db/track');
const errorCodes = require('../../utils/errorCodes');
const likeTrackService = require('../../services/UserService.js').likeTrack;
const { TrackDoesNotExistError } = require('../../db/track/errors');
const { 
  errorResponseBody, 
  genericErrorBody 
} = require('../../utils/errorResponse');
const { 
  constructEntityResponse, 
  ENTITY_TYPES 
} = require('../../utils/response');
const Joi = require('joi');
const validation = require('../../utils/validation');
const { LINK_TYPES } = require('../../conf/links');
const { sanitizeLinks } = require('../../utils/links')
const { verifyTrackOwner } = require('../../utils/track');

const  getSanitizedArtistLinks = async userId => {
  const links = await userQueries.getLinks(userId);
  return sanitizeLinks(links, LINK_TYPES.ARTIST);
};

const NOTIFICATION = {
  SKIPPED: 'skipped',
  BELOW_THRESHOLD: 'belowThreshold'
};

const queryCompetitionNotifications = async userId => {
  let newSkippedTracks = [];
  let newCompetitionLosses = [];

  try {
      const skippedTracksPromise = userQueries.getSkippedTracks(userId);
      const newCompetitionLossesPromise = userQueries.getCompetitionLosses(userId);
      [newSkippedTracks, newCompetitionLosses] = await Promise.all([skippedTracksPromise, newCompetitionLossesPromise]);
  } catch (err) {
    throw(err)
  }

  const newSkippedTracksNotifications = newSkippedTracks.map(track => {
    return {
      trackId: track.trackId,
      genre: track.genre,
      dateSkipped: track.date,
      acknowledged: track.acknowledged,
      type: NOTIFICATION.SKIPPED
    };
  });

  const newBelowThresholdNotifications = newCompetitionLosses.map(track => {
    return {
      trackId: track.trackId,
      genre: track.genre,
      date: track.date,
      wins: track.wins,
      losses: track.losses,
      acknowledged: track.acknowledged,
      type: NOTIFICATION.BELOW_THRESHOLD
    };
  });

  const notifications = {
    skippedTracks: newSkippedTracksNotifications,
    belowThreshold: newBelowThresholdNotifications
  };

  return notifications;
}

module.exports = {
	
	/***************
	**** public ****
  ***************/

  /**
   * Validates the input for an endpoint with trackId in POST body or URL
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The function to invoke to move on to next middleware
   * @returns {object} The result of calling the next middleware
   */
  validateTrackIdInput(req, res, next) {
    const trackId = req.params.trackId || req.body.trackId;
    const schema = Joi.object({
      trackId: Joi.number().required()
    });
    const input = { trackId };
    try {
      validation.validateInput(res, schema, input);
    } catch(err) {
      return next(err); 
    }
    return next();
  },

  getMyProfile: async function(req, res, next) {
    const userId = req.user && req.user.dbId;
    let userDetails = {};

    try {
      userDetails = await userQueries.getUserDetails(userId)
    } catch (err) {
      // TODO: handle get record not found error
      console.error("GET_MY_PROFILE_ERROR", err);
      return res.status(500).send(genericErrorBody);
    }
    
    let response = constructEntityResponse(
        ENTITY_TYPES.ARTISTS,
        userId,
        {
            id: userDetails.id,
            name: userDetails.name,
            instagramHandle: userDetails.instagramHandle || '',
            twitterHandle: userDetails.twitterHandle || ''
        },
        null
    );
    
    res.json(response);
  },
  
	getUserDetails: async function(req, res, next) {
    const userId = req.params.userId;
    let userDetails = {};

    // Validate inputs
    const schema = Joi.object({
      userId: Joi.number().required()
    });
    const input = { userId };
    try {
        validation.validateInput(res, schema, input);
    } catch (err) {
      return next(err);
    }

    try {
      userDetails = await userQueries.getUserDetails(userId)
    } catch (err) {
      // TODO: handle get record not found error
      return res.status(500).send(genericErrorBody);
    }
    
    let response = constructEntityResponse(
        ENTITY_TYPES.ARTISTS,
        userDetails.id,
        {
            id: userDetails.id,
            name: userDetails.name,
            instagramHandle: userDetails.instagramHandle || '',
            twitterHandle: userDetails.twitterHandle || ''
        },
        null
    );

    res.json(response);
  },

	getUserTracks: async function(req, res, next) {
    const userId = req.params.userId;
    let artistTracks = {}

    // Validate inputs
    const schema = Joi.object({
      userId: Joi.number().required()
    });
    const input = { userId };
    try {
        validation.validateInput(res, schema, input);
    } catch (err) {
      return next(err);
    }

    try {
      artistTracks = await userQueries.getArtistTracks(userId)
    } catch (err) {
      // TODO: handle get record not found error
      return res.status(500).send(genericErrorBody);
    }
    res.json({
      tracks: artistTracks
    });
  },

  getMyTracks: async function(req, res) {
    const userId = req.user.dbId;
    let myTracks = {};
    
    try {
      myTracks = await userQueries.getArtistTracks(userId)
    } catch (err) {
      // TODO: handle get record not found error
      return res.status(500).send(genericErrorBody);
    }

    res.json({
      tracks: myTracks
    });
  },

  likeTrack: async function(req, res) {
    const userId = req.user.dbId;
    const trackId = req.body.trackId;
    let tracks = {};

    tracks[trackId] = {
      isLiked: true
    };

    try {
      await likeTrackService(userId, trackId);
    } catch (err) {
      console.log(err instanceof TrackDoesNotExistError)
      if (err instanceof TrackDoesNotExistError) {
        // TODO: there is a bug where this never hits
        return res.status(500).send({ error: 'Track does not exist.' });
      } else {
        return res.status(500).send({ error: 'Unable to add track to favorites.' });
      }
    }

    res.send({
      tracks: tracks
    });
  },

  unlikeTrack: async function(req, res) {
    const userId = req.user.dbId;
    const trackId = req.params.trackId;
    let tracks = {};

    tracks[trackId] = {
      isLiked: false
    };

    try {
      await userQueries.unlikeTrack(userId, trackId);
    } catch (err) {
      return res.status(500).send({ error: 'Unable to remove track from favorites.' });
    }

    res.send({
      tracks: tracks
    });    
  },  

  getLikedTracks: async function(req, res) {
    const userId = req.user.dbId;
    let entities = {};

    try {
      entities = await userQueries.getLikedTracks(userId);
    } catch (err) {
      console.log(err)
      return res.status(500).send({ error: 'Cannot get liked tracks.' });
    }

    res.send(entities);
  },

  addUserLink: async function(req, res, next) {
    // TODO: validate safe link
    const userId = req.user.dbId;
    const url = req.body.url;
    const type = req.body.type;
    let links;

    const schema = Joi.object({
      type: Joi.string().valid(trackQueries.getTrackLinkTypes()).required()
    });
    const input = { type };
    try {
        validation.validateInput(res, schema, input);
        const linkConf = LINK_TYPES.ARTIST[type];
        validation.validateLinkUrl(res, url, linkConf);
    } catch (err) {
        return next(err);
    }

    try {
      await userQueries.addLink(userId, url, type);
      links = await getSanitizedArtistLinks(userId);
    } catch (err) {
      let responseStatus = 500;
      let body = genericErrorBody;

      if (err && err.errno == 1062) {
        responseStatus = 409;
        body = errorResponseBody(
          errorCodes.LINK_ALREADY_EXISTS,
          'Cannot add duplicate link.'
        ) 
      }
      return res.status(responseStatus).send(body);
    }

    res.send({
      links: links 
    });
  },

  getUserLinks: async function(req, res) {
    const userId = req.params.userId || (req.user && req.user.dbId);
    let links;
    try {
      links = await getSanitizedArtistLinks(userId);
    } catch (err) {
      return res.status(500).send({ error: 'Unable to get user links.' });
    }

    const response = constructEntityResponse(
      ENTITY_TYPES.ARTISTS,
      userId,
      { links }
    );

    res.send(response);
  },

  deleteUserLink: async function(req, res) {
    const userId = req.user.dbId;
    const linkId = req.body.id;

    let links;

    try {
      await userQueries.deleteLink(userId, linkId);
      links = await getSanitizedArtistLinks(userId);
    } catch (err) {
      return res.status(500).send(genericErrorBody);
    }

    res.send({
      links: links 
    });
  },

  getMyNewAwards: async function(req, res, next) {
    const userId = req.user.dbId;
    let awards = [];

    try {
      awards = await userQueries.getNewAwards(userId);
    } catch (err) {
      return res.status(500).send(genericErrorBody);
    }

    return res.json({ awards });
  },

  getMyCompetitionNotifications: async function(req, res, next) {
    const userId = req.user.dbId;
    let notifications = {};

    try {
      notifications = await queryCompetitionNotifications(userId)
    } catch (err) {
      console.error(err);
      return res.status(500).send(genericErrorBody);
    }

    return res.json({ notifications });
  },

  setTrackNotificationsAcknowledged: async function(req, res, next) {
    const userId = req.user.dbId;
    const trackId = req.params.trackId;
    let notifications = {};

    const schema = Joi.object({
        trackId: Joi.number().required()
    });

    const input = { trackId };
    try {
        validation.validateInput(res, schema, input);
    } catch (err) {
        return next(err);
    }

    try {
        await verifyTrackOwner(userId, trackId);
        const belowThresholdNotificationsPromise = await userQueries.setBelowThresholdNotificationsAcknowledged(trackId);
        const skippedTracksPromise = await userQueries.setSkippedTracksAcknowledged(trackId);

        await Promise.all([belowThresholdNotificationsPromise, skippedTracksPromise]);
        notifications = await queryCompetitionNotifications(userId)
    } catch (err) {
        return res.status(500).send(genericErrorBody);
    }

    return res.json({ notifications });
  },

  updateMyProfile: async function(req, res, next) {
    const { 
      username, 
      instagramHandle, 
      twitterHandle 
    } = req.body;
    const userId = req.user.dbId;

    if (typeof username === 'string') {
      try {
        await userQueries.updateUsername(userId, username)
        userDetails = await userQueries.getUserDetails(userId)
      } catch (err) {
        console.error(err)
        return next(err)
      }
    }

    if (typeof instagramHandle === 'string') {
      try {
        await userQueries.updateInstagramHandle(userId, instagramHandle)
        userDetails = await userQueries.getUserDetails(userId)
      } catch (err) {
        console.error(err)
        return next(err)
      }
    }

    if (typeof twitterHandle === 'string') {
      try {
        await userQueries.updateTwitterHandle(userId, twitterHandle)
        userDetails = await userQueries.getUserDetails(userId)
      } catch (err) {
        console.error(err)
        return next(err)
      }
    }

    try {
      const userDetails = await userQueries.getUserDetails(userId)
      let response = constructEntityResponse(
        ENTITY_TYPES.ARTISTS,
        userDetails.id,
        {
            id: userDetails.id,
            name: userDetails.name,
            instagramHandle: userDetails.instagramHandle || '',
            twitterHandle: userDetails.twitterHandle || ''
        },
        null
      );

      res.json(response);      
    } catch (err) {
      console.error(err)
      return next(err)
    }
  }
};