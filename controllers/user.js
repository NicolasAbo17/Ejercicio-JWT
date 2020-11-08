const { mongoUtils, dataBase } = require('../lib/utils/mongo.js');
const COLLECTION_NAME = 'users';
const bcrypt = require('bcrypt');
const auth = require('../lib/utils/auth.js');
const saltRounds = 10;
const User = require('../models/user');

async function login(user) {
    return mongoUtils.conn().then(async (client) => {
      const requestedUser = await client
        .db(dataBase)
        .collection(COLLECTION_NAME)
        .findOne({username: user.username})
        .finally(() => client.close());
        
      const isValid = await bcrypt.compare(user.password, requestedUser.password);
      // DONE create token
      // Return user without sensitive data and JWT
      let currentUser = {...requestedUser};
      if(isValid){
          delete currentUser.password;
          let token = auth.createToken(currentUser);
          currentUser.token = token;
          return currentUser;
      } else {
          throw new Error('Authetication failed');
      }      
  });
}

async function createUser(userInfo) {
  const { username, email, password, role } = userInfo
  user = new User({ username, email, password, role: role || "client" });

  if(user.password){
      // DONE use bcrypt to hash password 
      user.password = await bcrypt.hash(user.password, saltRounds);
  }
  // Save new user with password hashed
  return mongoUtils.conn().then(async (client) => {
    const newUser = await client
      .db(dataBase)
      .collection(COLLECTION_NAME)
      .insertOne(user)
      .finally(() => client.close());
      
    // DONE Delete sensitive information
    newUser && newUser.ops ? delete newUser.ops[0].password: newUser;
    return newUser.ops[0];
  });
}

module.exports = [createUser, login];
