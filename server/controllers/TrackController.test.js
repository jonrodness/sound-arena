const dateFormat = require('dateformat');
const fs = require('fs');
const mysql = require('../db/mysql');
const {
  mockAuthService,
  deleteAuthRouteTest,
  getAuthRouteTest,
  postAuthRouteTest,
  mockDbError,
} = require('../../test/utils');

jest.mock('../db/mysql'); // Sets connect() result to 'undefined'
jest.mock('../utils/encryption');
const {
  encryptString,
} = require('../utils/encryption');

// DB responses
const verifyTrackOwnerDbResult = JSON.parse(fs.readFileSync('test/stubs/db/verify-track-owner.json'));
const verifyTrackOwnerDbResultFail = JSON.parse(fs.readFileSync('test/stubs/db/verify-track-owner-fail.json'));
const deleteTrackLinkDbResultSuccess = JSON.parse(fs.readFileSync('test/stubs/db/delete-track-link-success.json'));
const deleteTrackLinkDbResultFail = JSON.parse(fs.readFileSync('test/stubs/db/delete-track-link-fail.json'));
const trackDetailsDbResult = JSON.parse(fs.readFileSync('test/stubs/db/track-details.json'));
const trackLinksDbResult = JSON.parse(fs.readFileSync('test/stubs/db/track/links.json'));
const trackAwardsDbResult = JSON.parse(fs.readFileSync('test/stubs/db/track/awards.json'));
const trackInvalidLinksDbResult = JSON.parse(fs.readFileSync('test/stubs/db/track/invalid-links.json'));
const dbDuplicateEntryError = JSON.parse(fs.readFileSync('test/stubs/db/duplicate-entry-error.json'));
const dbGetTodayEntriesStatus = JSON.parse(fs.readFileSync('test/stubs/db/track/get-today-entry-status.json'));
const dbGetTodayPlayedStatus = JSON.parse(fs.readFileSync('test/stubs/db/track/get-today-played-status.json'));

// Server responses
const trackLinksServerResponse = JSON.parse(fs.readFileSync('test/stubs/server/track/links.json'));
const trackAwardsServerResponse = JSON.parse(fs.readFileSync('test/stubs/server/track/awards.json'));
const trackDetailsServerResponse = JSON.parse(fs.readFileSync('test/stubs/server/track/track-details.json'));
const postTrackLinkServerResponse = JSON.parse(fs.readFileSync('test/stubs/server/post-track-link.json'));
const genericErrorServerResponse = JSON.parse(fs.readFileSync('test/stubs/server/generic-500.json'));
const unauthorizedErrorServerResponse = JSON.parse(fs.readFileSync('test/stubs/server/error/unauthorized-401.json'));
const dupLinkServerErrResponse = JSON.parse(fs.readFileSync('test/stubs/server/user-controller/error/duplicate-link.json'));
const serverTrackStatus = JSON.parse(fs.readFileSync('test/stubs/server/track/track-status.json'));

describe('/track/:trackId', async () => {
  const endpoint = '/api/track/1234';

  test('responds successfully with details', (done) => {
    mysql.query = jest.fn(() => new Promise((res) => res(trackDetailsDbResult)));
    getAuthRouteTest(done, endpoint, 200, trackDetailsServerResponse);
  });

  test('responds with 500 error if db exception', (done) => {
    mockDbError();
    const errResponse = {
      error: 'Sorry, we could not process your request.',
    };
    getAuthRouteTest(done, endpoint, 500, errResponse);
  });

  test('responds with 400 if invalid trackId', (done) => {
    const invalidEndpoint = '/api/track/string';
    const responseBody = {
      error: '"trackId" must be a number',
    };

    getAuthRouteTest(done, invalidEndpoint, 400, responseBody);
  });
});

describe('/track/:trackId/links', async () => {
  const endpoint = '/api/track/1234/links';

  test('responds successfully with links', (done) => {
    mysql.query = jest.fn(() => new Promise((res) => res(trackLinksDbResult)));
    getAuthRouteTest(done, endpoint, 200, trackLinksServerResponse);
  });

  test('filters invalid links', (done) => {
    mysql.query = jest.fn(() => new Promise((res) => res(trackInvalidLinksDbResult)));
    getAuthRouteTest(done, endpoint, 200, trackLinksServerResponse);
  });

  test('responds with 500 error if db exception', (done) => {
    mockDbError();
    const errResponse = {
      error: 'Unable to get track links.',
    };
    getAuthRouteTest(done, endpoint, 500, errResponse);
  });

  test('responds with 400 if invalid trackId', (done) => {
    const invalidEndpoint = '/api/track/string/links';
    const responseBody = {
      error: '"trackId" must be a number',
    };

    getAuthRouteTest(done, invalidEndpoint, 400, responseBody);
  });
});

describe('/auth/track/:trackId/link', async () => {
  const endpoint = '/api/auth/track/1234/link';
  const validPostData = {
    url: 'https://open.spotify.com/track/1b6Spq4MiEzShOsdfg',
    type: 'spotify',
  };
  let dbMock;

  beforeEach(() => {
    dbMock = mockAuthService();
  });

  describe('POST', () => {
    test('responds successfully with links', (done) => {
      dbMock.mockReturnValueOnce(Promise.resolve(verifyTrackOwnerDbResult));
      dbMock.mockReturnValueOnce(Promise.resolve());
      dbMock.mockReturnValueOnce(Promise.resolve(trackLinksDbResult));
      postAuthRouteTest(done, endpoint, validPostData, 200, postTrackLinkServerResponse);
    });

    test('responds with 500 error if db verify track owner exception', (done) => {
      mockDbError();
      postAuthRouteTest(done, endpoint, validPostData, 500, genericErrorServerResponse);
    });

    test('responds with 500 error if db add exception', (done) => {
      dbMock.mockReturnValueOnce(Promise.resolve(verifyTrackOwnerDbResult));
      mockDbError();
      postAuthRouteTest(done, endpoint, validPostData, 500, genericErrorServerResponse);
    });

    test('responds with 500 error if db get exception', (done) => {
      dbMock.mockReturnValueOnce(Promise.resolve(verifyTrackOwnerDbResult));
      dbMock.mockReturnValueOnce(Promise.resolve());
      mockDbError();
      postAuthRouteTest(done, endpoint, validPostData, 500, genericErrorServerResponse);
    });

    test('fails if link already exists', (done) => {
      dbMock.mockReturnValueOnce(Promise.resolve(verifyTrackOwnerDbResult));
      dbMock.mockImplementationOnce(() => Promise.reject(dbDuplicateEntryError));
      postAuthRouteTest(done, endpoint, validPostData, 409, dupLinkServerErrResponse);
    });

    test('fails if invalid link type', (done) => {
      const invalidPostData = {
        url: 'https://open.spotify.com/track/1b6Spq4MiEzShOsdfg',
        type: 'invalid-type',
      };
      const errResponse = {
        error: '"type" must be one of [spotify]',
      };
      postAuthRouteTest(done, endpoint, invalidPostData, 400, errResponse);
    });

    test('fails if invalid url', (done) => {
      const invalidPostData = {
        path: 'https://open.spotify.com/track/1b6Spq4MiEzShOsdfg?234adfasd',
        type: 'spotify',
      };
      const errResponse = {
        error: 'Invalid URL',
      };
      postAuthRouteTest(done, endpoint, invalidPostData, 400, errResponse);
    });
  });

  describe('DELETE', () => {
    const endpoint = '/api/auth/track/link/101';
    const validDeleteBody = {
      trackId: 1234,
    };
    test('responds successfully with links', (done) => {
      dbMock.mockReturnValueOnce(Promise.resolve(verifyTrackOwnerDbResult));
      dbMock.mockReturnValueOnce(Promise.resolve(deleteTrackLinkDbResultSuccess));
      dbMock.mockReturnValueOnce(Promise.resolve(trackLinksDbResult));
      deleteAuthRouteTest(done, endpoint, validDeleteBody, 200, postTrackLinkServerResponse);
    });

    test('responds with 500 error if verify track owner db exception', (done) => {
      mockDbError();
      deleteAuthRouteTest(done, endpoint, validDeleteBody, 500, genericErrorServerResponse);
    });

    test('responds with 500 error if verify track owner fails', (done) => {
      dbMock.mockReturnValueOnce(Promise.resolve(verifyTrackOwnerDbResultFail));
      dbMock.mockReturnValueOnce(Promise.resolve(deleteTrackLinkDbResultSuccess));
      dbMock.mockReturnValueOnce(Promise.resolve(trackLinksDbResult));
      deleteAuthRouteTest(done, endpoint, validDeleteBody, 500, genericErrorServerResponse);
    });

    test('responds with 500 error if no affected db rows', (done) => {
      dbMock.mockReturnValueOnce(Promise.resolve(verifyTrackOwnerDbResult));
      dbMock.mockReturnValueOnce(Promise.resolve(deleteTrackLinkDbResultFail));
      deleteAuthRouteTest(done, endpoint, validDeleteBody, 500, genericErrorServerResponse);
    });

    test('responds with 500 error if db delete exception', (done) => {
      dbMock.mockReturnValueOnce(Promise.resolve(verifyTrackOwnerDbResult));
      mockDbError();
      deleteAuthRouteTest(done, endpoint, validDeleteBody, 500, genericErrorServerResponse);
    });

    test('responds with 500 error if db get exception', (done) => {
      dbMock.mockReturnValueOnce(Promise.resolve(verifyTrackOwnerDbResult));
      dbMock.mockReturnValueOnce(Promise.resolve());
      mockDbError();
      deleteAuthRouteTest(done, endpoint, validDeleteBody, 500, genericErrorServerResponse);
    });

    test('fails if invalid trackId', (done) => {
      const invalidPostData = {
        trackId: 'invalid-type',
      };
      const errResponse = {
        error: '"trackId" must be a number',
      };
      deleteAuthRouteTest(done, endpoint, invalidPostData, 400, errResponse);
    });

    test('fails if invalid linkId', (done) => {
      const invalidEndpoint = '/api/auth/track/link/invalid-id';
      const errResponse = {
        error: '"linkId" must be a number',
      };
      deleteAuthRouteTest(done, invalidEndpoint, validDeleteBody, 400, errResponse);
    });
  });
});

describe('/auth/track/:trackId/status', async () => {
  const endpoint = '/api/auth/track/1234/status';
  let dbMock;
  let rapStatus;
  let dbGetLast10DaysStatus;

  const updateStub = () => {
    // programmatically make each date in result up-to-date
    const rapStatus = serverTrackStatus.tracks[1234].competitionStatus.last10Days.rap;

    for (let i = 10; i > 0; i--) {
      const dateISO = generateISOStringDate(i - 1);
      const dateFormatted = dateFormat(dateISO, 'dddd, mmmm d, yyyy');
      rapStatus[10 - i].date = dateFormatted;
    }
  };

  const updateResponse = () => {
    dbGetLast10DaysStatus = [
      {
        genre: 'rap',
        date: generateISOStringDate(1),
        count: 3,
      },
    ];
  };

  beforeEach(() => {
    dbMock = mockAuthService();
  });

  beforeAll(() => {
    updateStub();
    updateResponse();
  });

  const generateISOStringDate = (daysAgo) => {
    const date = new Date(); // today
    date.setDate(date.getDate() - daysAgo);

    return date.toISOString();
  };

  test('responds successfully with track score', (done) => {
    dbMock.mockReturnValueOnce(Promise.resolve(verifyTrackOwnerDbResult));
    dbMock.mockReturnValueOnce(Promise.resolve(dbGetLast10DaysStatus));
    dbMock.mockReturnValueOnce(Promise.resolve(dbGetTodayEntriesStatus));
    dbMock.mockReturnValueOnce(Promise.resolve(dbGetTodayPlayedStatus));

    getAuthRouteTest(done, endpoint, 200, serverTrackStatus);
  });

  test('responds with 400 if invalid trackId', (done) => {
    const invalidEndpoint = '/api/auth/track/string/status';
    const responseBody = {
      error: '"trackId" must be a number',
    };

    getAuthRouteTest(done, invalidEndpoint, 400, responseBody);
  });

  test('responds with 401 error if verify track owner fails', (done) => {
    dbMock.mockReturnValueOnce(Promise.resolve(verifyTrackOwnerDbResultFail));
    getAuthRouteTest(done, endpoint, 401, unauthorizedErrorServerResponse);
  });

  test('responds with 500 error if db error on last 10 days', (done) => {
    dbMock.mockReturnValueOnce(Promise.resolve(verifyTrackOwnerDbResult));
    dbMock.mockImplementationOnce(() => Promise.reject(dbDuplicateEntryError));
    getAuthRouteTest(done, endpoint, 500, genericErrorServerResponse);
  });

  test('responds with 500 error if db error on today entries status', (done) => {
    dbMock.mockReturnValueOnce(Promise.resolve(verifyTrackOwnerDbResult));
    dbMock.mockReturnValueOnce(Promise.resolve(dbGetLast10DaysStatus));
    dbMock.mockImplementationOnce(() => Promise.reject(dbDuplicateEntryError));
    getAuthRouteTest(done, endpoint, 500, genericErrorServerResponse);
  });

  test('responds with 500 error if db error on today played status', (done) => {
    dbMock.mockReturnValueOnce(Promise.resolve(verifyTrackOwnerDbResult));
    dbMock.mockReturnValueOnce(Promise.resolve(dbGetLast10DaysStatus));
    dbMock.mockReturnValueOnce(Promise.resolve(dbGetTodayEntriesStatus));
    dbMock.mockImplementationOnce(() => Promise.reject(dbDuplicateEntryError));
    getAuthRouteTest(done, endpoint, 500, genericErrorServerResponse);
  });
});

describe('/track/:trackId/awards', async () => {
  const endpoint = '/api/auth/track/1234/awards';
  let dbMock;

  beforeEach(() => {
    dbMock = mockAuthService();
  });

  test('responds successfully with filtered awards', (done) => {
    // Mock encryptString because IV is different every time
    encryptString.mockReturnValue(
      {
        iv: '1234',
        encryptedStr: 'f8da',
      },
    );

    dbMock.mockReturnValueOnce(Promise.resolve(verifyTrackOwnerDbResult));
    dbMock.mockReturnValueOnce(Promise.resolve(trackAwardsDbResult));

    getAuthRouteTest(done, endpoint, 200, trackAwardsServerResponse);
  });

  test('responds with 500 error if db exception', (done) => {
    dbMock.mockReturnValueOnce(Promise.resolve(verifyTrackOwnerDbResult));
    dbMock.mockImplementationOnce(() => { throw new Error(); });
    const errResponse = {
      error: 'Unable to get track awards.',
    };
    getAuthRouteTest(done, endpoint, 500, errResponse);
  });

  test('responds with 400 if invalid trackId', (done) => {
    const invalidEndpoint = '/api/auth/track/string/awards';
    const responseBody = {
      error: '"trackId" must be a number',
    };

    getAuthRouteTest(done, invalidEndpoint, 400, responseBody);
  });
});
