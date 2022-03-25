//Searches users database using email address
const getUserByEmail = (email, users) => {
  for (let userid in users) {
    if (users[userid].email === email) {
      return users[userid];
    }
  }
  return null;
};

//Generates random strings
const generateRandomString = (noOfChars) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < noOfChars; i++) {
    const randomCharacterPosition = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomCharacterPosition);
  }
  return randomString;
};

module.exports = {getUserByEmail, generateRandomString};