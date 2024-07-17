const mongoose = require('mongoose');

 //notes- required means: field is required for all documents that follow this schema, and it ensures that the key, as well as the type of data it stores as its value, will be uniform for all documents in the collection.
//notes- genre is key for movieSchema, and is a subdocument containing details like name and description
//[] - array data type


const bcrypt = require('bcrypt');


let movieSchema = mongoose.Schema({

    title: {type: String, required: true}, 
    description: {type: String, required: true},
    
    genre: {
      name: String,
      description: String
    },
    directors: {
      name: String,
      bio: String
    },
    actors: [String],
    imagepath: String,
    featured: Boolean
  });
  
  let userSchema = mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    birthday: Date,
    favorite_movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }] 
  });

  userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };
  
  userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };
//Don't use arrow functions when defining instance methods. validatePassword is an example of an instance method, a method that can be called on each object/document created (each individual object/document). 

      //notes-  the reference method is being used to link “Users” collection with“Movies” collection
    //alternatively can use .populate() to contain an array of actual movie documents. you can write a single query to pull information about the user along with their favorite movies compared to reference by using embedded data
  
  //This will create collections called “db.movies” and “db.users":
  //Keep an eye on your capital letters and plurals here—any titles you pass through will come out on the other side as lowercase and pluralized. For instance, above, the titles Movie and User will create collections called “db.movies” and “db.users”, respectively. eg Book - collection will be called "db.books"
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);

  
  //export these so they can be imported in index.js so the API endpoints can use these to query MongoDB database according to the defined schema
  module.exports.Movie = Movie;
  module.exports.User = User;
  