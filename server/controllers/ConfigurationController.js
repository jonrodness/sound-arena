const { LINK_TYPES } = require('../conf/links');

module.exports = {
  /**
   * Validates the input for an endpoint with trackId in POST body or URL
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The function to invoke to move on to next middleware
   * @returns {object} The result of calling the next middleware
   */
  getLinkTypes(req, res, next) {
    return res.json(LINK_TYPES);
  },
};
