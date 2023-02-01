const request = require('supertest');
const app = require('../app');
const mysql = require('../db/mysql');
const fs = require('fs');
const chartDbResult = JSON.parse(fs.readFileSync('test/stubs/db/chart.json'));

jest.mock('../db/mysql'); // Sets connect() result to 'undefined'

describe('GET api/chart', async function() {
    test('responds with chart results with valid inputs', function(done) {
        mysql.query = jest.fn(() =>
            new Promise(res => res(chartDbResult))
        );

        request(app)
            .get('/api/chart?days=10&genre=rap')
            .then(response => {
                expect(mysql.query).toBeCalled();
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(chartDbResult);
                done();
            });
    });

    test('responds with error with invalid inputs', function(done) {
        const err = {
            "error": "\"numDays\" must be one of [1, 10]"
        };
        request(app)
            .get('/api/chart?days=9&genre=rap')
            .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toEqual(err);
                done();
            });
    });
});