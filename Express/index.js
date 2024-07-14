const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');


const morgan = require ("morgan");
const app = express();
//mongoose related:
const mongoose = require('mongoose');
const Models = require('./models.js');
console.log(Models);   
const Movies = Models.Movie;
const Users = Models.User;



mongoose.connect('mongodb://localhost:27017/cfDB')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));
//cfDB - name of database when created with powerShell

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors'); 

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());


require('./swagger')(app);

//default text response when at /
app.get("/", (req, res) =>{
  res.send("Welcome to MyFlix");
});

//Get all Movies
app.get("/movies", (req,res) =>{
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
})

// Get all users
app.get('/users', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



//get move by title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({title: req.params.title})
    .then((movie) =>{
      res.json(movie);
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



//get movie details by genrename
app.get('/movies/genre/:name', (req, res) => {
  Movies.findOne({ 'genre.name': req.params.name })
    .then((genre) => {
      res.json(genre);
  })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err); 
      });
});

//get info by director name
app.get('/director/:name', (req, res) => {
  Movies.findOne({ 'directors.name': req.params.name })
    .then((director) => {
      res.json(director);
  })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err); 
      });
});


//create new user
app.post('/users', async (req, res) => {
  try {
    const existingUser = await Users.findOne({ username: req.body.username });
    
    if (existingUser) {
      return res.status(400).send(req.body.username + ' already exists');
    }
    
    const newUser = await Users.create({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      birthday: req.body.birthday,
      favorite_movies: req.body.favorite_movies
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error: ' + error);
  }
});


//update user details
app.put('/users/:username', async (req, res) => {
  await Users.findOneAndUpdate({ username: req.params.username }, { $set:
    {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      birthday: req.body.birthday,
      favorite_movies: req.body.favorite_movies
    }
  },
  { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })

});

// Delete a user by username
app.delete('/users/:username', async (req, res) => {
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




// Add a movie to a user's list of favorites
app.post('/users/:username/movies/:MovieID', async (req, res) => {
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

// Delete a movie to a user's list of favorites
app.delete('/users/:username/movies/:MovieID', async (req, res) => {
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




app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});