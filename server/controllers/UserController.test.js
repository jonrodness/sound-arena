const mysql = require('../db/mysql')
const fs = require('fs')
const {
    mockAuthService,
    mockGetUserResult,
    mockDbSuccess,
    deleteAuthRouteTest,
    getAuthRouteTest,
    postAuthRouteTest,
    mockDbError
} = require('../../test/utils')

// DB responses
const userLinksDbResult = JSON.parse(fs.readFileSync('test/stubs/db/user/links.json'))
const userInvalidLinksDbResult = JSON.parse(fs.readFileSync('test/stubs/db/user/invalid-links.json'))
const likedTracksDbResult = JSON.parse(fs.readFileSync('test/stubs/db/liked-tracks.json'))
const artistTracksDbResult = JSON.parse(fs.readFileSync('test/stubs/db/artist-tracks.json'))
const dbDuplicateEntryError = JSON.parse(fs.readFileSync('test/stubs/db/duplicate-entry-error.json'))
const userDetailsDbResult = JSON.parse(fs.readFileSync('test/stubs/db/user/details.json'))

// Server Responses
const userLinksServerResponse = JSON.parse(fs.readFileSync('test/stubs/server/user-links.json'))
const postUserLinkServerResponse = JSON.parse(fs.readFileSync('test/stubs/server/post-user-link.json'))
const dupLinkServerErrResponse = JSON.parse(fs.readFileSync('test/stubs/server/user-controller/error/duplicate-link.json'))
const genericErrorServerResponse = JSON.parse(fs.readFileSync('test/stubs/server/generic-500.json'))
const likedTracksServerResponse = JSON.parse(fs.readFileSync('test/stubs/server/liked-tracks.json'))
const likeTrackSuccessServerResponse = JSON.parse(fs.readFileSync('test/stubs/server/like-track-success.json'))
const unlikeTrackSuccessServerResponse = JSON.parse(fs.readFileSync('test/stubs/server/unlike-track-success.json'))
const artistTracksServerResult = JSON.parse(fs.readFileSync('test/stubs/server/user-controller/artist-tracks.json'))
const userDetailsServerResponse = JSON.parse(fs.readFileSync('test/stubs/server/user-controller/user-details.json'))

jest.mock('../db/mysql') // Sets connect() result to 'undefined'

/**
 * Adds user object to req, by mocking first db query
 * @returns {object} The mock function bound to the db query function
 *  for setting up subsequent mocks on db query
 */
const mockAddUserToReq = () => {
    const dbMock = jest.fn()
    mysql.query = dbMock        
    dbMock.mockReturnValueOnce(mockGetUserResult)
    return dbMock
}

describe('api/auth/profile', async function() {
    const endpoint = '/api/auth/my-profile' 
    let dbMock

    beforeEach(() => {
        dbMock = mockAuthService()
    })

    test('responds successfully with user details', function(done) {
        dbMock.mockImplementationOnce(() =>
            new Promise(res => res(userDetailsDbResult))
        )

        getAuthRouteTest(done, endpoint, 200, userDetailsServerResponse)
    })

    test('responds with 500 error if db exception', function(done) {
        mockDbError()
        const errResponse = {
            'error': 'Sorry, we could not process your request.'
        }
        getAuthRouteTest(done, endpoint, 500, errResponse)
    })

    test('responds with 400 if invalid userId', function(done) {
        const invalidEndpoint = '/api/user/string'
        const responseBody = {
            "error": "\"userId\" must be a number"
        }        

        getAuthRouteTest(done, invalidEndpoint, 400, responseBody)
    })    
})

describe('/user/:userId', async function() {
    const endpoint = '/api/user/1234'

    test('responds successfully with user details', function(done) {
        mysql.query = jest.fn(() =>
            new Promise(res => res(userDetailsDbResult))
        )
        getAuthRouteTest(done, endpoint, 200, userDetailsServerResponse)
    })

    test('responds with 500 error if db exception', function(done) {
        mockDbError()
        const errResponse = {
            'error': 'Sorry, we could not process your request.'
        }
        getAuthRouteTest(done, endpoint, 500, errResponse)
    })

    test('responds with 400 if invalid userId', function(done) {
        const invalidEndpoint = '/api/user/string'
        const responseBody = {
            "error": "\"userId\" must be a number"
        }        

        getAuthRouteTest(done, invalidEndpoint, 400, responseBody)
    })    
})

describe('api/user/:userId/tracks', async function() {
    const endpoint = '/api/user/1234/tracks'

    test('responds successfully with artist tracks', function(done) {
        mysql.query = jest.fn(() =>
            new Promise(res => res(artistTracksDbResult))
        )
        getAuthRouteTest(done, endpoint, 200, artistTracksServerResult)
    })

    test('fails when userid is invalid', function(done) {
        const invalidEndpoint = '/api/user/string/tracks'
        const responseBody = {
            "error": "\"userId\" must be a number"
        }
        getAuthRouteTest(done, invalidEndpoint, 400, responseBody)
    })

    test('fails when db query fails', function(done) {
        mockDbError()     
        getAuthRouteTest(done, endpoint, 500, genericErrorServerResponse)
    })     
})

describe('api/auth/my-tracks', async function() {
    const endpoint = '/api/auth/my-tracks'
    let dbMock

    beforeEach(() => {
        dbMock = mockAuthService()
    })

    test('responds successfully with artist tracks', function(done) {
        dbMock.mockImplementationOnce(() =>
            new Promise(res => res(artistTracksDbResult))
        )
        getAuthRouteTest(done, endpoint, 200, artistTracksServerResult)
    })

    test('fails when userid is invalid', function(done) {
        const invalidEndpoint = '/api/user/string/tracks'
        const responseBody = {
            "error": "\"userId\" must be a number"
        }
        getAuthRouteTest(done, invalidEndpoint, 400, responseBody)
    })

    test('fails when db query fails', function(done) {
        mockDbError()   
        getAuthRouteTest(done, endpoint, 500, genericErrorServerResponse)
    })     
})


describe('api/auth/liked-tracks', async function() {
    const endpoint = '/api/auth/liked-tracks'

    describe('GET', async function() {
        const errResponse = {
            'error': 'Cannot get liked tracks.'
        }

        test('responds successfully with liked tracks', function(done) {
            mysql.query = jest.fn(() =>
                new Promise(res => res(likedTracksDbResult))
            )
            getAuthRouteTest(done, endpoint, 200, likedTracksServerResponse)
        })

        test('responds with 500 error if db exception', function(done) {
            mockDbError()
            getAuthRouteTest(done, endpoint, 500, errResponse)
        })        
    })

    describe('POST', async function() {
        const validPostData = {
            trackId: 123
        }

        test('responds with tracks on success', function(done) {
            mockDbSuccess()
            postAuthRouteTest(done, endpoint, validPostData, 200, likeTrackSuccessServerResponse)
        })

        test('responds with 400 error with invalid inputs', function(done) {
            const errResponse = {
                'error': "\"trackId\" must be a number"
            }
            const invalidPostData = {
                trackId: 'string'
            }
            postAuthRouteTest(done, endpoint, invalidPostData, 400, errResponse)
        })
    
        test('responds with 500 error if db exception', function(done) {
            mockDbError()          
            const errResponse = {
                'error': 'Unable to add track to favorites.'
            }
            postAuthRouteTest(done, endpoint, validPostData, 500, errResponse)
        })
    })

    describe('DELETE', async function() {
        const endpoint = '/api/auth/liked-tracks/123'       
        const errResponse = {
            'error': 'Unable to remove track from favorites.'
        }

        test('responds with liked tracks', function(done) {
            mockDbSuccess()
            deleteAuthRouteTest(done, endpoint, {}, 200, unlikeTrackSuccessServerResponse)
        })

        test('responds with 400 error with invalid path param', function(done) {
            const invalidPath = '/api/auth/liked-tracks/asdf'
            const errResponse = {
                'error': "\"trackId\" must be a number"
            }

            deleteAuthRouteTest(done, invalidPath, {}, 400, errResponse)
        })        

        test('responds with 500 error if db exception', function(done) {
            mockDbError()
            deleteAuthRouteTest(done, endpoint, {}, 500, errResponse)
        })
    })
})

describe('api/auth/my-links', async function() {
    const endpoint = '/api/auth/my-links'

    test('responds successfully with links', function(done) {
        const dbMock = mockAddUserToReq()

        dbMock.mockReturnValueOnce(Promise.resolve(userLinksDbResult))
        getAuthRouteTest(done, endpoint, 200, userLinksServerResponse)
    })
    
    test('responds with 500 error if db exception', function(done) {
        mockDbError()
        const errResponse = {
            'error': 'Unable to get user links.'
        }        
        getAuthRouteTest(done, endpoint, 500, errResponse)
    })
})

describe('/user/:userId/links', async function() {
    const endpoint = '/api/user/userId1/links'

    test('responds successfully with links', function(done) {
        mysql.query = jest.fn(() =>
            new Promise(res => res(userLinksDbResult))
        )
        getAuthRouteTest(done, endpoint, 200, userLinksServerResponse)
    })

    test('filters invalid links', function(done) {
        mysql.query = jest.fn(() =>
            new Promise(res => res(userInvalidLinksDbResult))
        )
        getAuthRouteTest(done, endpoint, 200, userLinksServerResponse)
    })
    
    test('responds with 500 error if db exception', function(done) {
        mockDbError()
        const errResponse = {
            'error': 'Unable to get user links.'
        }
        getAuthRouteTest(done, endpoint, 500, errResponse)
    })
})

describe('/auth/user-link', async function() {
    const endpoint = '/api/auth/user-link'
    const validPostData = {
        url: 'https://open.spotify.com/artist/7t8q7ikEtcPNtoaKAm9Vu6',
        type: 'spotify'
    }
    let dbMock

    beforeEach(() => {
        dbMock = mockAuthService()
    })

    describe('POST', () => {
        test('responds successfully with links', function(done) {
            dbMock.mockReturnValueOnce(Promise.resolve())
            dbMock.mockReturnValueOnce(Promise.resolve(userLinksDbResult))
            postAuthRouteTest(done, endpoint, validPostData, 200, postUserLinkServerResponse)
        })
        
        test('responds with 500 error if db add exception', function(done) {
            mockDbError()        
            postAuthRouteTest(done, endpoint, validPostData, 500, genericErrorServerResponse)
        })

        test('responds with 500 error if db get exception', function(done) {
            dbMock.mockReturnValueOnce(Promise.resolve())           
            mockDbError()        
            postAuthRouteTest(done, endpoint, validPostData, 500, genericErrorServerResponse)
        })        

        test('fails if link already exists', function(done) {
            dbMock.mockImplementationOnce(() => Promise.reject(dbDuplicateEntryError))
            postAuthRouteTest(done, endpoint, validPostData, 409, dupLinkServerErrResponse)
        })

        test('fails if invalid link value', function(done) {
            const invalidPostData = {
                url: 'https://open.spotify.com/artist/7t8q7ikEtcPNtoaKAm9Vu6',
                type: 'invalid-type'
            }
            const errResponse = {
                'error': "\"type\" must be one of [spotify]"
            }
            postAuthRouteTest(done, endpoint, invalidPostData, 400, errResponse)
        })

        test('fails if invalid path type', function(done) {
            const invalidPostData = {
                url: 'https://open.spotify.com/artist/7t8q7ikEtcPNtoaKAm9Vu6?si=v0TLJxHMTiW11tqezHoTFA?434wrgqewr=asdfas',
                type: 'spotify'
            }
            const errResponse = {
                'error': "Invalid URL"
            }
            postAuthRouteTest(done, endpoint, invalidPostData, 400, errResponse)
        })
    })

    describe('DELETE', () => {
        const validDeleteData = {
            id: 2
        }

        test('responds successfully with links', function(done) {
            dbMock.mockReturnValueOnce(Promise.resolve())
            dbMock.mockReturnValueOnce(Promise.resolve(userLinksDbResult))
            deleteAuthRouteTest(done, endpoint, validDeleteData, 200, postUserLinkServerResponse)
        })
        
        test('responds with 500 error if db delete exception', function(done) {
            mockDbError()        
            deleteAuthRouteTest(done, endpoint, validDeleteData, 500, genericErrorServerResponse)
        })

        test('responds with 500 error if db get exception', function(done) {
            dbMock.mockReturnValueOnce(Promise.resolve())           
            mockDbError()        
            deleteAuthRouteTest(done, endpoint, validDeleteData, 500, genericErrorServerResponse)
        })

        test('fails if invalid path type', function(done) {
            const invalidPostData = {
                id: 'invalid-id'
            }
            const errResponse = {
                'error': "\"id\" must be a number"
            }
            deleteAuthRouteTest(done, endpoint, invalidPostData, 400, errResponse)
        })
    })
})