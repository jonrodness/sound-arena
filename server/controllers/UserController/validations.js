const Joi = require('joi');
const validation = require('../../utils/validation');

module.exports = {
  validateUserProfileInput(req, res, next) {
    const { 
      username,
      twitterHandle,
      instagramHandle
    } = req.body;

    const schema = Joi.object({
      username: Joi.string().min(1).max(30).optional(),
      twitterHandle: Joi.string().min(0).max(20).allow('').optional(),
      instagramHandle: Joi.string().min(0).max(40).allow('').optional()
    });

    const input = { 
      username,
      twitterHandle,
      instagramHandle
    };

    try {
      validation.validateInput(res, schema, input);
    } catch(err) {
      console.error(err);
      return next(err); 
    }
    return next();
  }
}