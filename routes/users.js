var express = require('express');
var router = express.Router();
var [createUser, login] = require('../controllers/user');

/* Create user. */
router.post('/register', async function(req, res, next) {
  const newUser = await createUser(req.body);
  res.send(newUser);
});
/** Login */
router.post('/login', async function(req, res, next) {
    const authUser = await login(req.body);
    res.send(authUser);
});

module.exports = router;
