const express = require('express');
morgan = require('morgan');
// import built in node modules fs and path 
fs = require('fs'), 
path = require('path');

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})



// setup the logger
app.use(morgan('common'));
app.use(morgan('combined', {stream: accessLogStream}));


//setup error handling
const bodyParser = require('body-parser'),
  methodOverride = require('method-override');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
  let responseText = 'Welcome to my app!';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

app.get('/secreturl', (req, res) => {
  let responseText = 'This is a secret url with super top-secret content.';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);

});

// serves documentation.html file or other files in public folder using express.static
app.use(express.static('public'));




// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });