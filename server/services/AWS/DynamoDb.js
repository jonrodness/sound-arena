const { dynamoDbDocClient } = require('./config');
const conf = require('../../conf');
const { TrackScoreDoesNotExistError } = require('../TrackService/errors')

class DynamoDbService {
    constructor() {}

    initTrackScore(trackId, trackScore) {
        const params = {
            TableName: conf.awsDynamoTrackscoreTablename,
            Item: {
                "TrackId": trackId.toString(),
                "Score": trackScore
            }
        }
        return new Promise((resolve, reject) => {
            dynamoDbDocClient.put(params, (err, data) => {
                if (err) reject(err)
                resolve(data)
            })
        })        
    }

    updateTrackScore(trackId, updatedTrackScore) {
        const params = {
            TableName: conf.awsDynamoTrackscoreTablename,
            Key: {
                "TrackId": trackId.toString()
            },
            UpdateExpression: "set Score = :s",
            ExpressionAttributeValues:{
                ":s": updatedTrackScore
            }            
        }
        return new Promise((resolve, reject) => {
            dynamoDbDocClient.update(params, (err, data) => {
                if (err) reject(err)
                resolve(data)
            })
        })        
    }

    getTrackScore(trackId) {
        const params = {
            TableName: conf.awsDynamoTrackscoreTablename,
            Key: {
                "TrackId": trackId.toString()
            }
        }
        return new Promise((resolve, reject) => {
            dynamoDbDocClient.get(params, (err, data) => {
                if (err) return reject(err)
                if (data.Item && data.Item.Score) return resolve(data.Item.Score)
                return reject(new TrackScoreDoesNotExistError())
            })
        })        
    }

    deleteTrackScore(trackId) {
        const params = {
            TableName: conf.awsDynamoTrackscoreTablename,
            Key: {
                "TrackId": trackId.toString()
            }
        }
        return new Promise((resolve, reject) => {
            dynamoDbDocClient.delete(params, (err, data) => {
                if (err) reject(err)
                resolve(data)
            })
        })
    }
};

module.exports = {
    DynamoDbService
};