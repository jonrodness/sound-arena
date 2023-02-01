const { ValidationError } = require('./validation');

const errorCodes = require('./errorCodes');

const ERRORS = {
  OUT_OF_TRACKS: {
    code: errorCodes.OUT_OF_TRACKS,
    message: 'Out of tracks',
  },
  COMPETITION_RESET: {
    code: errorCodes.COMPETITION_RESET,
    message: 'Competition reset',
  },
};

const genericErrorMessage = 'Sorry, we could not process your request.';

const errorResponseBody = (code, message) => ({
  error: {
    code,
    message,
  },
});

const getCompetitionResetError = (competitionState) => {
  const body = errorResponse(ERRORS.COMPETITION_RESET);
  body.competition = competitionState;
  return body;
};

const errorResponse = (error) => ({ error });

module.exports = {
  ERRORS,

  getCompetitionResetError,

  genericErrorHandler: (err, req, res, next) => {
    res.status(500);
    return res.send('Sorry, something went wrong.');
  },

  validationErrorHandler: (err, req, res, next) => {
    if (err instanceof ValidationError) {
      return res.status(400).send(err.message);
    }

    next(err);
  },

  errorResponseBody,

  errorResponse,

  unauthorizedBody: errorResponseBody(
    errorCodes.NOT_AUTHORIZED,
    'User is not authorized for this action.',
  ),

  genericErrorMessage,
  genericErrorBody: {
    error: genericErrorMessage,
  },
};
