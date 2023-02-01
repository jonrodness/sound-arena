const mysql = require('../server/db/mysql')
const admin = require('firebase-admin')
const request = require('supertest')
const app = require('../server/app')

const dbUser = [{
    id: 'userId1'
}]

const authHeader = [
    'authorization', 
    'Bearer 1234'
]

module.exports = {
    deleteAuthRouteTest: (done, path, body, status, responseBody) => {
        request(app)
            .delete(path)
            .set(...authHeader)
            .send(body)
            .then(response => {
                expect(response.statusCode).toBe(status)
                expect(response.body).toEqual(responseBody)
                done()
            })
    },
    
    getAuthRouteTest: (done, path, status, responseBody) => {
        request(app)
            .get(path)
            .set(...authHeader)
            .then(response => {
                expect(response.statusCode).toBe(status)
                expect(response.body).toEqual(responseBody)
                done()
            })
    },
    
    postAuthRouteTest: (done, path, postData, status, responseBody) => {
        request(app)
            .post(path)
            .set(...authHeader)
            .send(postData)
            .then(response => {
                expect(response.statusCode).toBe(status)
                expect(response.body).toEqual(responseBody)
                done()
            })
    },
    
  /**
   * Mocks authentication service and db to allow testing of routes requiring authentication
   */
    mockAuthService: () => {
        const decodedToken = {};
        const userDbRes = [{
            id: 'userId1'
        }];

        const mysqlMock = jest.fn();
        mysqlMock.mockReturnValueOnce(Promise.resolve(userDbRes))
        mysql.query = mysqlMock;

        admin.auth().verifyIdToken = jest.fn(() => {
            return new Promise(res => res(decodedToken));
        });
    
        return mysqlMock;
    },

    // Authorization header with mock value
    authHeader,

    mockGetUserResult: Promise.resolve(dbUser),

    mockDbSuccess: () => {
        mysql.query = jest.fn(() =>
            new Promise(res => res([]))
        )
    },

    mockDbError: () => {
        mysql.query = jest.fn(() => Promise.reject())
    }    
}