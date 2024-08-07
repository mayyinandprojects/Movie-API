//authentication using jwt
//The first thing to do is create a new endpoint for the API with the URL “/login”. You could technically add this endpoint alongside your other endpoints, but since you’re going to implement special authentication measures for this request, let's put the endpoint in a separate file, called “auth.js” (for “authentication”).With the code you write in this file, you’ll be able to create a new endpoint for registered users to log in. This code will authenticate login requests using basic HTTP authentication and generate a JWT for the user.


const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); // Your local passport file


let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username, // This is the username you’re encoding in the JWT
    expiresIn: '7d', // This specifies that the token will expire in 7 days
    algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
  });
}


/* POST login. */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());//creates a jwt based on the user name and password
        return res.json({ user, token }); //ES6 shorthand for res.json({ user: user, token: token })
      });
    })(req, res);
  });
}