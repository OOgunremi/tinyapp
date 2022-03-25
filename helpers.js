const getUserByEmail = (email, users) => {
  for (let userid in users) {
    if (users[userid].email === email) {
      return users[userid];
    }
  }
  return null;
};
module.exports = {getUserByEmail};