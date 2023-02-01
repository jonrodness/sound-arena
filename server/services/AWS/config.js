const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.AWS_REGION,
    signatureVersion: 'v4'
});

AWS.config.setPromisesDependency(Promise);

const s3 = new AWS.S3();
const dynamoDbDocClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
    s3,
    dynamoDbDocClient
}