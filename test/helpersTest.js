const { assert, Assertion } = require('chai');

const { getUserByEmail, generateRandomString } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID);
  });
  it('should return null with an invalid email', function() {
    const user = getUserByEmail("userxyz@example.com", testUsers);
    assert.equal(user, null);
  });
});

describe('generateRandomString', function() {
  it('should return 6 random strings when 6 is the argument', function() {
    const noOfChars = (generateRandomString(6)).length;
    assert.equal(noOfChars, 6);
  });
  it('should return random strings everytime', function() {
    const noOfChars1 = (generateRandomString(6));
    const noOfChars2 = (generateRandomString(6));
    assert.notEqual(noOfChars1, noOfChars2);
  });

});