var express = require('express');
var router = express.Router();
var [createUser, login] = require('../controllers/user');

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const users = await getUsers();
  res.send(users);
});

/* Create user. */
router.post('/register', async function(req, res, next) {
  const newUser = await createUser(req.body);
  res.send(newUser);
});

/** Login */
router.post('/login', async function(req, res, next) {
  try {
    const authUser = await login(req.body);
    res.send(authUser);
  } catch (error) {
    res.send(403).json({
      success: false,
      message: 'Incorrect username or password'
    })
  }
});

module.exports = router;
