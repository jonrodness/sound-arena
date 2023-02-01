const {
  queryCompetitionState,
  setForceResetFalse,
} = require('../db/competition');
const {
  getCompetitionResetError,
} = require('../utils/errorResponse');

module.exports = {
  addCompetitionToReq: async (req, res, next) => {
    const userId = req.user.dbId;

    try {
      const competitionState = await queryCompetitionState(userId);

      req.competitionState = competitionState;
      next();
    } catch {
      next(err);
    }
  },

  checkForceReset: async (req, res, next) => {
    const userId = req.user.dbId;
    const forceReset = req.competitionState && req.competitionState.forceReset;

    if (forceReset) {
      const body = getCompetitionResetError(req.competitionState);
      // Competition was reset so clear flag and inform client
      await setForceResetFalse(userId);
      return res.status(400).send(body);
    }

    next();
  },
};
