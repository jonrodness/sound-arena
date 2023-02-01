const FEATURES = {
  TRACK_SCORE: 'TRACK_SCORE',
  REDIS_LPOS: 'REDIS_LPOS',
};

module.exports = {
  FEATURES,
  isFeatureEnabled: (featureKey) => {
    switch (featureKey) {
      case FEATURES.TRACK_SCORE:
        return process.env.FEATURE_ENABLED_TRACK_SCORE === 'true';
      case FEATURES.REDIS_LPOS:
        return process.env.FEATURE_ENABLED_REDIS_LPOS === 'true';
      default:
        return false;
    }
  },
};
