const fs = require('fs');
const { sanitizeLinks } = require('./links');

const invalidUserLinks = JSON.parse(fs.readFileSync('test/stubs/db/user/invalid-links.json'));
const sanitizedUserLinks = JSON.parse(fs.readFileSync('test/stubs/db/user/links.json'));
const { LINK_TYPES } = require('../conf/links');

describe('sanitizeLinks', async () => {
  test('filters links', () => {
    expect(sanitizeLinks(invalidUserLinks, LINK_TYPES.ARTIST)).toEqual(sanitizedUserLinks);
  });
});
