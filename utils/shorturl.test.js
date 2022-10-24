const shorturl = require('./shorturl');

test('Just first test', () => {
  expect(shorturl.generateNewId()).toBe(Number);
});
