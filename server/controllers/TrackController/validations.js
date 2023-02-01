const Joi = require('joi');
const validation = require('../../utils/validation');

module.exports = {
  validateAwardVersion0(req, res, next) {
    const awardLinkVersion = req.query.i;
    if (awardLinkVersion !== '0') return next()
    
    const a = req.query.a; // encrypted award
    const v = req.query.v; // initialization vector
    const t = req.query.t; // auth tag
    const i = req.query.i; // encryption version
    const id = req.query.id; // track id

    const schema = Joi.object({
        a: Joi.string().required(),
        v: Joi.string().required(),
        i: Joi.string().required(),
        id: Joi.string().required(),
        t: Joi.string().required()
    });

    const input = { 
        a, 
        v,
        i,
        id,
        t
    };

    try {
        validation.validateInput(res, schema, input);
    } catch (err) {
        return next(err);
    }
    return next();
  },

  validateAwardVersion1(req, res, next) {
    const awardLinkVersion = req.query.i;
    if (awardLinkVersion !== '1') return next()

    const date = req.query.d;
    const genre = req.query.g;
    const place = req.query.p;
    const awardGroupId = req.query.gid;
    const totalParticipants = req.query.tp;
    const hmac = req.query.h;
    const awardId = req.query.id;

    const schema = Joi.object({
        date: Joi.string().required(),
        genre: Joi.string().required(),
        place: Joi.string().required(),
        awardGroupId: Joi.string().required(),
        totalParticipants: Joi.string().required(),
        hmac: Joi.string().required(),
        awardId: Joi.string().required()
    });

    const input = { 
        date,
        genre,
        place,
        awardGroupId,
        totalParticipants,
        hmac,
        awardId
    };

    try {
        validation.validateInput(res, schema, input);
    } catch (err) {
        return next(err);
    }
    return next();
  }
}