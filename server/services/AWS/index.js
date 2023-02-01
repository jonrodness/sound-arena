const { s3 } = require('./config');
const { DynamoDbService } = require('./DynamoDb');
const { S3Service } = require('./S3');

module.exports = {
    s3,
    DynamoDbService,
    S3Service
};