const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const morgan = require("morgan");
const cors = require('cors');
const app = express();

// mongoose related:
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;


// mongoose.connect('mongodb://localhost:27017/cfDB')
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Could not connect to MongoDB', err));
require('dotenv').config();
mongoose.connect(process.env.CONNECTION_URI)
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.error('Could not connect to MongoDB', err));



const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const bcrypt = require('bcrypt'); //to hash users’ passwords and compare hashed passwords every time users log in
const { check, validationResult } = require('express-validator');



let auth = require('./auth.js')(app); //import your “auth.js” file into your project. To do so, add the following code to your “index.js” file. Be sure to place it AFTER your bodyParser middleware function (app.use(bodyParser.urlencoded({ extended: true }));):

//add these after let auth = require('./auth')(app);
const passport = require('passport');
require('./passport.js');

let allowedOrigins = ['http://localhost:8080', 'http://movie-api-4o5a.onrender.com', 'http://localhost:1234'];

// Enable CORS for all routes
// app.use(cors());


//Cross-Origin Resource Sharing (CORS) for only certain routes,  creates a list of allowed domains within the variable allowedOrigins, then compares the domains of any incoming request with this list and either allows it (if the domain is on the list) or returns an error (if the domain isn’t on the list). As a general rule, you should only allow requests from domains that need your API. For this reason, it’s usually considered bad practice to use an asterisk * to grant access to all domains.
// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
//       let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//       return callback(new Error(message), false);
//     }
//     return callback(null, true);
//   }
// }));
app.use(cors({
  origin: (origin, callback) => {
    console.log('Origin:', origin); // Add this line to debug which origin is being checked
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  }
}));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('./swagger.js')(app);


/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     responses:
 *       200:
 *         description: Welcome to MyFlix
 */
app.get("/", (req, res) => {
  res.send("Welcome to MyFlix");
});

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
app.get('/movies', async (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
//the GET request now has three parameters: the URL, the passport.authenticate('jwt', {session: false}) function, and the callback function. Now, any request to the “movies” endpoint will require a JWT from the client. The JWT will be decoded and checked by the JWT authentication strategy created earlier using Passport, which will authenticate the request.

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * @swagger
 * /movies/{title}:
 *   get:
 *     summary: Get a movie by title
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: Title of the movie
 *     responses:
 *       200:
 *         description: A movie object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 */
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * @swagger
 * /movies/genre/{name}:
 *   get:
 *     summary: Get a movie by genre name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the genre
 *     responses:
 *       200:
 *         description: A genre object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 */
app.get('/movies/genre/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'genre.name': req.params.name })
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

/**
 * @swagger
 * /director/{name}:
 *   get:
 *     summary: Get a director by name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the director
 *     responses:
 *       200:
 *         description: A director object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Director'
 */
app.get('/director/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'directors.name': req.params.name })
    .then((director) => {
      res.json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The created user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Username already exists
 */
app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('username', 'Username is required').isLength({min: 5}),
    check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
  let hashedPassword = Users.hashPassword(req.body.password);

  try {
    const existingUser = await Users.findOne({ username: req.body.username });

    if (existingUser) {
      return res.status(400).send(req.body.username + ' already exists');
    }

    const newUser = await Users.create({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      birthday: req.body.birthday,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error: ' + error);
  }
});

/**
 * @swagger
 * /users/{username}:
 *   put:
 *     summary: Update a user by username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The updated user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Error updating user
 */
app.put('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ username: req.params.username }, {
    $set: {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      birthday: req.body.birthday
    }
  },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * @swagger
 * /users/{username}:
 *   delete:
 *     summary: Delete a user by username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user to delete
 *     responses:
 *       200:
 *         description: User was deleted
 *       400:
 *         description: User was not found
 */
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndDelete({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * @swagger
 * /users/{username}/movies/{MovieID}:
 *   post:
 *     summary: Add a movie to a user's list of favorites
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user
 *       - in: path
 *         name: MovieID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to add
 *     responses:
 *       200:
 *         description: The updated user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Error adding movie to favorites
 */
app.post('/users/:username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ username: req.params.username }, {
    $push: { favorite_movies: req.params.MovieID }
  },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * @swagger
 * /users/{username}/movies/{MovieID}:
 *   delete:
 *     summary: Remove a movie from a user's list of favorites
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user
 *       - in: path
 *         name: MovieID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to remove
 *     responses:
 *       200:
 *         description: The updated user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Error removing movie from favorites
 */
app.delete('/users/:username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ username: req.params.username }, {
    $pull: { favorite_movies: req.params.MovieID }
  },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// app.listen(8080, () => {
//   console.log('Your app is listening on port 8080');
// });
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         genre:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *         directors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *         description:
 *           type: string
 *         imageURL:
 *           type: string
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         email:
 *           type: string
 *         birthday:
 *           type: string
 *           format: date
 *         favorite_movies:
 *           type: array
 *           items:
 *             type: string
 */
