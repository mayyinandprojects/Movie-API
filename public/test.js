const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

app.use(express.json());
app.use(bodyParser.json());

let users = [
  { id: 1,
    name: "Max Musterman",
    favouriteMovies: ["The Godfather"]    
  },
  { id: 2,
    name: "Jane Doe",
    favouriteMovies: ["Pulp Fiction"]    
  }

]



let movies = [
  {
    id: 1,
    title: "The Godfather",
    year: 1972,
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    genre: {
      name: "Crime",
      description: "Crime films center on the lives of criminals."
    },
    director: {
      name: "Francis Ford Coppola",
      bio: "Francis Ford Coppola is an American film director, producer, and screenwriter known for his epic film The Godfather and its sequels. He has won multiple Academy Awards.",
      birthday: "April 7, 1939"
    },
    imageURL: "https://m.media-amazon.com/images/M/MV5BNzk3YzkyMjYtZTYyOC00Y2ZkLWExMWItNWZjMzlhNWNjYzYxXkEyXkFqcGdeQXVyMTEwNDU1MzEy._V1_FMjpg_UX800_.jpg",
    featured: true
  },
  {
    id: 2,
    title: "Star Wars: Episode IV – A New Hope",
    year: 1977,
    description: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee, and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.",
    genre: {
      name: "Adventure",
      description: "Adventure films involve exploration or quests."
    },
    director: {
      name: "George Lucas",
      bio: "George Lucas is an American film director, producer, and screenwriter best known for creating the Star Wars and Indiana Jones franchises. He is a pioneer in modern filmmaking techniques.",
      birthday: "May 14, 1944"
    },
    imageURL: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    featured: true
  },
  {
    id: 3,
    title: "Pulp Fiction",
    year: 1994,
    description: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    genre: {
      name: "Crime",
      description: "Crime films center on the lives of criminals."
    },
    director: {
      name: "Quentin Tarantino",
      bio: "Quentin Tarantino is an American filmmaker and screenwriter known for his stylized, non-linear storytelling and his love of film history. He has directed several critically acclaimed movies.",
      birthday: "March 27, 1963"
    },
    imageURL: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY1200_CR97,0,630,1200_AL_.jpg",
    featured: false
  }
];

require('../swagger')(app);

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Retrieve a list of movies
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get('/users', (req, res) => {
  res.status(200).json(users);
});

/**
 * @swagger
 * /movies/{title}:
 *   get:
 *     summary: Retrieve a movie by title
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie title
 *     responses:
 *       200:
 *         description: A movie object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: No such movie
 */
app.get('/movies/:title', (req, res) => {
  const { title } = req.params; 
  const movie = movies.find(movie => movie.title === title);

  if (movie){
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie');
  }
});

/**
 * @swagger
 * /movies/genre/{genreName}:
 *   get:
 *     summary: Retrieve movies by genre
 *     parameters:
 *       - in: path
 *         name: genreName
 *         required: true
 *         schema:
 *           type: string
 *         description: The genre name
 *     responses:
 *       200:
 *         description: A genre object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: No such genre
 */
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params; 
  const genre = movies.find(movie => movie.genre.name.toLowerCase() === genreName.toLowerCase()).genre;
  if (genre){
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre');
  }
});

/**
 * @swagger
 * /movies/director/{directorName}:
 *   get:
 *     summary: Retrieve movies by director
 *     parameters:
 *       - in: path
 *         name: directorName
 *         required: true
 *         schema:
 *           type: string
 *         description: The director name
 *     responses:
 *       200:
 *         description: A director object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: No such director
 */
app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params; 
  const movie = movies.find(movie => movie.director.name.toLowerCase() === directorName.toLowerCase());

  if (movie) {
    const director = movie.director;
    res.status(200).json(director);
  } else {
    res.status(400).send('No such director');
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Users need names
 */
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name){
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('users need names');
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user info
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: No such user
 */
app.put('/users/:id', (req, res) => {
  const {id} = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user){
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user');
  }
});

/**
 * @swagger
 * /users/{id}/{movietitle}:
 *   post:
 *     summary: Add favourite movie for user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: path
 *         name: movietitle
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie title
 *     responses:
 *       200:
 *         description: Movie added to user's favourites
 *       400:
 *         description: No such user
 */
app.post('/users/:id/:movietitle', (req, res) => {
  const { id, movietitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user){
    user.favouriteMovies.push(movietitle);
    res.status(200).send(`${movietitle} has been added to user ${id}'s array`); 
  } else {
    res.status(400).send('no such user');
  }
});

/**
 * @swagger
 * /users/{id}/{movietitle}:
 *   delete:
 *     summary: Remove favourite movie for user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: path
 *         name: movietitle
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie title
 *     responses:
 *       200:
 *         description: Movie removed from user's favourites
 *       400:
 *         description: No such user
 */
app.delete('/users/:id/:movietitle', (req, res) => {
  const { id, movietitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user){
    user.favouriteMovies = user.favouriteMovies.filter(title => title !== movietitle);
    res.status(200).send(`${movietitle} has been removed from user ${id}'s array`); 
  } else {
    res.status(400).send('no such user');
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The updated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: No such user
 */
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    users = users.filter(user => user.id != id);
    res.json(users);
  } else {
    res.status(400).send('no such user');
  }
});

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Add a new movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created movie object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Missing title in request body
 */
app.post('/movies', (req, res) => {
  let newMovie = req.body;

  if (!newMovie.title) {
    const message = 'Missing title in request body';
    res.status(400).send(message);
  } else {
    newMovie.id = uuid.v4();
    movies.push(newMovie);
    res.status(201).send(newMovie);
  }
});




app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});