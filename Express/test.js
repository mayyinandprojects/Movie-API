const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

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

// READ
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});


// READ
app.get('/users', (req, res) => {
  res.status(200).json(users);
});

// READ
// Gets the data about a movie, by title
app.get('/movies/:title', (req, res) => {
  //using object desctructuring, create new variable title that is same title on the other side, alternative: const title = req.params.title;
  const { title } = req.params; 
  const movie = movies.find( movie => movie.title === title);

  if (movie){
    res.status(200).json(movie);
  } else{
    res.status(400).send('no such movie')
  }

});


// READ
// Gets the data about movies of a specific genre
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params; 
  const genre = movies.find(movie => movie.genre.name.toLowerCase() === genreName.toLowerCase()).genre;
  if (genre){
    res.status(200).json(genre);
  } else{
    res.status(400).send('no such genre')
  }


});

// READ
// Gets the data about a specific director
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

//CREATE
//add new user
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name){
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need names')
  }
}); 

//UPDATE 
//update user info
app.put('/users/:id', (req, res) => {
  const {id} = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id);

  if (user){
    user.name = updatedUser.name;
    res.status(200).json(user)
  } else {
    res.status(400).send('no such user')
  }
});

//CREATE 
//add favourite movie based on user ID
app.post('/users/:id/:movietitle', (req, res) => {
  const { id, movietitle } = req.params;

  let user = users.find( user => user.id == id);

  if (user){
    user.favouriteMovies.push(movietitle);
    res.status(200).send('$(movietitle) has been added to user $(id)\'s array'); 
  } else {
    res.status(400).send('no such user')
  }
});

//DELETE 
//remove favourite movie based on user ID
app.delete('/users/:id/:movietitle', (req, res) => {
  const { id, movietitle } = req.params;

  let user = users.find( user => user.id == id);

  if (user){
    user.favouriteMovies = user.favouriteMovies.filter( title => title !== movietitle);
    res.status(200).send('$(movietitle) has been removed from user $(id)\'s array'); 
  } else {
    res.status(400).send('no such user')
  }
});

//DELETE 
//delete user
app.delete('/users/:id', (req, res) => {
  const { id, movietitle } = req.params;

  let user = users.find( user => user.id == id);

  if (user) {
    users = users.filter( user => user.id != id);
    res.json(users)
    //res.status(200).send('user $(id) has been deleted'); 
  } else {
    res.status(400).send('no such user')
  }
});

// CREATE 
// add data for a new movie to our list of movies.
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