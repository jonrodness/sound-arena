module.exports = {
    awsDynamoTrackscoreTablename: process.env.AWS_DYNAMO_TRACKSCORE_TABLENAME || '',
    hostingPlatform: process.env.HOSTING_PLATFORM || '',
    s3BucketName: process.env.S3_BUCKET_NAME || '',
    matchupExpiryInMinutes: parseInt(process.env.MATCHUP_EXPIRY_IN_MINUTES || '30'),
    awardLinkVersion: parseInt(process.env.AWARD_LINK_VERSION) || 1,
    hmacSecret: process.env.HMAC_SECRET || '',
    refillQueueMinScore: parseFloat(process.env.REFILL_QUEUE_MIN_SCORE || '0'),
    minCompetitionEntries: parseInt(process.env.MINIMUM_COMPETITION_ENTRIES || '15') 
}