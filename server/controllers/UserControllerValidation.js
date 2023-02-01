const Joi = require('joi');
const validation = require('../utils/validation');

module.exports = {
  /**
     * Validates the input for an endpoint with trackId in POST body or URL
     * @param {object} req - The request object
     * @param {object} res - The response object
     * @param {function} next - The function to invoke to move on to next middleware
     * @returns {object} The result of calling the next middleware
     */
  deleteUserLinkValidation: (req, res, next) => {
    const { id } = req.body;

    const schema = Joi.object({
      id: Joi.number().required(),
    });
    const input = { id };
    try {
      validation.validateInput(res, schema, input);
    } catch (err) {
      next(err);
    }
    return next();
  },
};
