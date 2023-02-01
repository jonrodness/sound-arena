const path = require('path');
const fs = require('fs');
const { decryptString } = require('../utils/encryption');
const validation = require('../utils/validation');
const Joi = require('joi');
const { TRACK_AWARD_GROUPS } = require('../controllers/TrackController');
const { htmlEncode } = require('../utils/sanitize');
const { getAwardFromVersion1Link } = require('../utils/awards');
const HOST_NAME = process.env.HOST_NAME;
const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  /**
   * Dynamically generates index.js to include OG meta tags for Awards
   */
  getAwardPage(req, res, next) {
    console.log('controllerStart', `controller: StaticPageController.getStaticTrackPage`);
    const awardLinkVersion = req.query.i;
    
    // TODO: This should change as it will break if this file moves relative to the build file
    const dirPath = NODE_ENV === 'production' ? '../../client/build' : '../../client/public';
    const indexPath = path.resolve(__dirname, dirPath, 'index.html');

    let input;
    let schema;
    let award;

    try {
      // If validation fails, fallback to serving unmodified index.html in catch block
      switch(awardLinkVersion) {
        case '0':
          const a = req.query.a; // encrypted award
          const v = req.query.v; // initialization vector
          const t = req.query.t; // auth tag
      
          schema = Joi.object({
              a: Joi.string().required(),
              v: Joi.string().required(),
              t: Joi.string().required()
          });
      
          input = { 
              a, 
              v,
              t
          };
          validation.validateInput(res, schema, input);
          const awardString = decryptString(a, v, t);
          award = JSON.parse(awardString);
          break;
        case '1':
          const date = req.query.d;
          const genre = req.query.g;
          const place = req.query.p;
          const awardGroupId = req.query.gid;
          const totalParticipants = req.query.tp;
          const hmac = req.query.h;
          const awardId = req.query.id;
      
          schema = Joi.object({
              date: Joi.string().required(),
              genre: Joi.string().required(),
              place: Joi.string().required(),
              awardGroupId: Joi.string().required(),
              totalParticipants: Joi.string().required(),
              hmac: Joi.string().required(),
              awardId: Joi.string().required()
          });
      
          input = { 
              date,
              genre,
              place,
              awardGroupId,
              totalParticipants,
              hmac,
              awardId
          };
          validation.validateInput(res, schema, input);
          award = getAwardFromVersion1Link(req.query);
          break;
        default:
          console.error('Incorrect static page params');
          throw new Error('Incorrect static page params');
      }

      const {
          genre,
          place,
          totalParticipants,
          date,
          awardGroupId
      } = award;

      // Default with top 10%
      let imagePath = TRACK_AWARD_GROUPS.TOP_10_PERCENT.OG_IMAGE_PATH;

      switch (awardGroupId) {
        case TRACK_AWARD_GROUPS.TOP_10_PERCENT.id:
          imagePath = TRACK_AWARD_GROUPS.TOP_10_PERCENT.OG_IMAGE_PATH;
          break;
        case TRACK_AWARD_GROUPS.TOP_25_PERCENT.id:
          imagePath = TRACK_AWARD_GROUPS.TOP_25_PERCENT.OG_IMAGE_PATH;
          break;
        case TRACK_AWARD_GROUPS.TOP_50_PERCENT.id:
          imagePath = TRACK_AWARD_GROUPS.TOP_50_PERCENT.OG_IMAGE_PATH;
          break;
      }

      const formattedDate = new Date(date).toDateString();
      
      const safeOgImageUrl =`${HOST_NAME}${imagePath}`;
      const ogTitle = `Check out my track! It ranked ${place} out of ${totalParticipants} in the ${ genre } competition on ${ formattedDate } at SoundArena.`;
      // ogUrl contains untrusted data
      const safeOgTitle = htmlEncode(ogTitle);
      const ogUrl = `${HOST_NAME}/track${req.path}`;
      // ogURL will contain path, but the trackId is paramaterized and untrusted, so sanitize with html escaping 
      const safeOgUrl = htmlEncode(ogUrl);
      
      fs.readFile(indexPath, 'utf8', function (err, data) {
          if (err) {
            // Fallback to original page
            res.sendFile(indexPath);
          }

          // Leave out og:url out for now for security as it is not necessary for MVP
          // <meta property="og:url" content="${safeOgUrl}" />
          const newPath = `/track${req.path}`;

          // Redirect to /track/ static path
          const injectString = `
            <meta property="og:title" content="${safeOgTitle}" />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="${safeOgImageUrl}" />
            <script>window.location.pathname = "${newPath}";</script>
          `;
          
          // Replace the OG content in <head> with OG meta tags
          updatedHtml = data.replace(/<meta name="og-start">(.*)<meta name="og-end">/gs, injectString);
          console.log('controllerSuccess', `controller: StaticPageController.getStaticTrackPage`);
          res.send(updatedHtml);
        });
    } catch (err) {
        // Fallback to original page
        res.sendFile(indexPath);
    }  
  }
}