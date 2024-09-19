// import the modules
const dotenv = require('dotenv'); // requires the package
dotenv.config(); // Loads the environment variables from .env file
const express = require('express');
const app = express();  
// It’s important that these two lines of code are at the top of this file
// it ensures that the environment variables are available everywhere across your application.
const mongoose = require('mongoose'); // you need to require mongoose so that we can use it to connect to our database:
const methodOverride = require('method-override'); // tricks our express app into thinking that we’ve made PUT and DELETE requests from the browser.
const morgan = require('morgan'); // The morgan middleware serves as a logging tool for our HTTP requests, providing valuable insights into application behavior.
const session = require('express-session'); 

// import the controllers so you can use them
const authController = require('./controllers/auth.js');
const tracksController = require('./controllers/tracks.js');
const playlistsController = require('./controllers/playlists.js');

// server config and connection-------------------------------
const port = process.env.PORT ? process.env.PORT : '3000'; 
// Connects to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// middleware----------------------------------------
app.use(express.urlencoded({ extended: false }));
// ^^ When a user submits the form on the /fruits/new page, the browser sends a request to our server with the form data. 
// ^^ To access this data in Express, we need to use middleware. Specifically, we’ll use express.urlencoded. 
// ^^ This middleware parses incoming request bodies, extracting form data and converting it into a JavaScript object. 
// ^^ It then attaches this object to the req.body property of the request, making the form data easily accessible within our route handlers.
// ^^ Remember, app.use allows us to plug additional functionality into express. It basically extends the capabilities of our app.
app.use(methodOverride('_method')); // uses method override package for full CRUD actions
app.use(morgan('dev')); // logs database responses 
app.use(express.static('public'));

// Session middleware should be initialized before any other custom middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
); 

// custom middleware------------------------------------
const isSignedIn = require('./middleware/is-signed-in.js'); // must be placed above all routes and controllers
const passUserToView = require('./middleware/pass-user-to-views.js'); // must be placed above all routes and controllers
app.use(passUserToView); // Custom middleware

app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
}); // loads the landing page

app.use('/auth', authController); // needed in order for the controllers to work
app.use(isSignedIn);
app.use('/users/:userId/playlists', playlistsController); // needed in order for the controllers to work
app.use('/tracks', tracksController); // needed in order for the controllers to work

// routes--------------


// Starts the server
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
}); // (remember, all routes should be defined above app.listen()).