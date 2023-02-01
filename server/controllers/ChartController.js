/**
 * ChartController
 */
const Joi = require('joi');
const chartQueries = require('../db/chart');
const competitionQueries = require('../db/competition');
const validation = require('../utils/validation');

module.exports = {
  /**
     * @deprecated
     *
     */
  async getChart(req, res, next) {
    const numDays = parseInt(req.query.days);
    const { genre } = req.query;
    let chartResults;

    const schema = Joi.object({
      numDays: Joi.number().valid(chartQueries.getChartDayOptions()),
      genre: Joi.string().valid(...competitionQueries.getGenres()),
    });

    const input = { numDays, genre };

    try {
      validation.validateInput(res, schema, input);
      chartResults = await chartQueries.getChartStatistics(numDays, genre);
    } catch (err) {
      return next(err);
    }

    res.json(chartResults);
  },

  async getCompetitionResults(req, res, next) {
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);
    const { genre } = req.query;
    let competitionResults;

    const schema = Joi.object({
      offset: Joi.number().min(0).max(9999),
      limit: Joi.number().min(1).max(10),
      genre: Joi.string().valid(...competitionQueries.getGenres()),
    });

    const input = { offset, limit, genre };

    try {
      validation.validateInput(res, schema, input);

      const [
        competitionResults,
        metaData,
      ] = await Promise.all([
        chartQueries.getLatestCompetitionResults(offset, limit, genre),
        chartQueries.getLatestCompetitionMetaData(genre),
      ]);

      const competitionMetaData = metaData && metaData.length && metaData[0];

      const count = competitionMetaData ? competitionMetaData.count : 0;
      const date = competitionMetaData ? competitionMetaData.date : null;

      res.json({
        competitionResults,
        totalResultsCount: count,
        date,
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  },
};
