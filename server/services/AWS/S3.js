const { s3 } = require('./config');
const { s3BucketName, matchupExpiryInMinutes } = require('../../conf');

// URL should expire after no longer than 30 mins
const urlExpiryTime = Math.min(matchupExpiryInMinutes * 60, 1800);

class S3Service {
    constructor() {}

    async getSignedReadUrl(objectKey) {
        const params = {
            Bucket: s3BucketName,
            Key: objectKey,
            Expires: urlExpiryTime
        };
        const signedReadUrl = await s3.getSignedUrlPromise('getObject', params);
        return signedReadUrl;
    }
};

module.exports = {
    S3Service
};