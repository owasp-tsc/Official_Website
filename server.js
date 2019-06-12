console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// serve files from the public directory
app.use(express.static('public'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to the db and start the express server
let db;

// ***Replace the URL below with the URL for your database***
const url =  'mongodb://localhost:27017/owasp';
// E.g. for option 2) above this will be:
// const url =  'mongodb://localhost:21017/databaseName';

MongoClient.connect(url, (err, database) => {
  if(err) {
    return console.log(err);
  }
  db=database;
  // start the express web server listening on 8080
  app.listen(8080, () => {
    console.log('listening on 8080');
  });
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/contact.html');
});

app.get('/aboutus', (req, res) => {
  res.sendFile(__dirname + '/about.html');
});

app.get('/blog', (req, res) => {
  res.sendFile(__dirname + '/blog.html');
});

app.get('/team_members', (req, res) => {
  res.sendFile(__dirname + '/speakers.html');
});



// add a document to the DB collection recording the click event
app.post('/register', (req, res) => {
  console.log(req.body);
  var eventregistration = req.body;
  
    db.collection('eventregistration').save(eventregistration, (err, result) => {
      if (err) {
        return console.log(err);
      }
      console.log('click added to db');
      //res.sendStatus(201);
      res.send([{
        message: 'User successfully registered',
        status: true
      }])
    });
  });
