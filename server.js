console.log('Server-side code running');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
// const app = express();
const path = require('path');
var nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
// var app1=require('express')();
// var http = require('http').Server(app1)

// // var server = require('https').createServer(app);
// const client = require('socket.io')(http); //.listen(4001).sockets;
// http = require('http');
// var server = http.createServer(app);
// var client = require('socket.io').listen(server);

// server.listen(process.env.PORT);
// server.listen(4001);
// const socketIO = require('socket.io');
// const server = express()
//   .use((req, res) => res.sendFile(index) )
//   .listen(process.env.port ||4000, () => console.log(`Listening on ${ process.env.port }`));

// // const client = socketIO(server);
// var socket = require('socket.io')

// var server = app.listen(4000, function(){
//     console.log('listening for requests on port 4000,');
// });

// let client = socket(server);

var port = process.env.PORT || 3000;

var app = express.createServer()
var client = require('socket.io').listen(app);

app.listen(port);

// Heroku setting for long polling
client.configure(function () {
    client.set("transports", ["xhr-polling"]);
    client.set("polling duration", 10);
});
// serve files from the public directory
app.use(express.static('public'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// connect to the db and start the express server
let db;

// ***Replace the URL below with the URL for your database***
//const url = 'mongodb://localhost:27017/owasp';
const mgClienturl = 'mongodb://ThaparUser:Pass#123@ds237337.mlab.com:37337/owasp';
var options = {
  user: "ThaparUser",
  pass: "Pass#123",
  auth: {
    authdb: 'owasp',
},
useNewUrlParser: true ,
  };

// Create mongo connection
const conn = mongoose.createConnection(mgClienturl, options);


//     authdb: "admin",
//     user: "ThaparUser",
//   pass: "Pass#123",

// }}).then(function(db){

//     // do whatever you want

//     mongoose.connection.close() // close db

// })
// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// const storage = new GridFsStorage({
//   url: url,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });

const storage = new GridFsStorage({
  url: mgClienturl,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
    });
  }
});

const upload = multer({ storage });


app.set('view engine', 'ejs');

app.post('/upload', upload.single('file'), (req, res) => {
  res.redirect('/galleryshow');
});


MongoClient.connect(mgClienturl, (err, database) => {
  if (err) {
    return console.log(err);
  }
  db = database;
  
 //initialize our stream
//  gfs = Grid(db, MongoClient);
//  gfs.collection('uploads');
 
  // start the express web server listening on 8080
  app.listen((port || 8080), () => {
    console.log('listening on deployed server');
});
  client.on('connection', function (socket) {
    console.log('Client Socket connected');

    let eventdetails = db.collection('eventdetails');

    // create function to send status//whenever we want to side something from servere side to client side we use emit to do so to show it in html file
    sendStatus = function (s) {
      socket.emit('status', s);
    };

    //get chats from mongo collection
    eventdetails.find().limit(100).sort({ _id: 1, eventname: 1, time: 1 }).toArray(function (err, res) {
      if (err) {
        throw err;
      }
      // emit the messages
      socket.emit('output', res);
    });

    // handle input events
    socket.on('input', function (data) {
      let eventname = data.eventname;
      let eventsubname = data.eventsubname;
      let time = data.time;
      let location = data.location;

      // handle clear
      socket.on('clear', function (data) {
        //remove all chats from the collection
        eventdetails.remove({}, function () {
          socket.emit('cleared');
        });
      });
    });
  });
});


// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/gallery', (req, res) => {
  res.sendFile(__dirname + '/imagecontrol.html');
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


app.get('/options', (req, res) => {
  res.sendFile(__dirname + '/schedule.html');
});

app.get('/eventupdate', (req, res) => {
  res.sendFile(__dirname + '/updateevent.html');
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
// add a document to the DB collection recording the click event
app.post('/updateevents', (req, res) => {
  console.log(req.body);
  var eventupdatedetailes = req.body;

  db.collection('eventdetails').save(eventupdatedetailes, (err, result) => {
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
  // get the click data from the database
  app.post('/login', (req, res) => {
    console.log(req.body);
    var admin = req.body;
  
    db.collection('admin').find(
        {
          userName: admin.userName,
          userPassword: admin.userPassword,
        }).toArray((err, result) => {
      if (err)
      { 
        res.send(err);
      }
      else
      {
        res.send(result);
      }
    });
  });
  

//@routes GET /files 
//@desc Display all files in Json
app.get('/galleryshow', (req, res) => {
 
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('galleryshowcase', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render('galleryshowcase', { files: files });
    }
  });
})
app.get('/galleryshowcase/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // If File exists this will get executed
    const readstream = gfs.createReadStream(file.filename);
    return readstream.pipe(res);
  });
});

app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if the input is a valid image or not
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // If the file exists then check whether it is an image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

// delete function to remove the file from the database
app.delete('/galleryshowcase/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect('/');
  });
});
let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
      user: 'GBM918211@gmail.com',
      pass: 'Pass#123!'
  },
  tls: {
      rejectUnauthorized: true
  }
});
// const port = 8080;
// app.listen(port, () => console.log(`Server started on port ${port}`));
app.post('/sendmessage', (req, res) => {
  console.log(req.body);
  var message = req.body;

  db.collection('eventquery').save(message, (err, result) => {
    if (err) {
      return console.log(err);
    }

    let HelperOptions = {
      from: 'GBM918211@gmail.com',
      to: 'GBM918211@gmail.com',
      subject: "Enquiry by" + message.name +"email id is " +message.email,
      text: message.message,

  };
  transporter.sendMail(HelperOptions, (error, info) => {
      if (error) {
          console.log(error);
      }
      else {
          console.log("message sent");
      }
  });
    console.log('click added to db');
    //res.sendStatus(201);
    res.send([{
      message: 'User successfully registered',
      status: true
    }])
  });
});