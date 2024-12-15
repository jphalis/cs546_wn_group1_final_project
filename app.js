// This file should set up the express server

import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import configRoutes from './routes/index.js';

const app = express();

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect('/login/signinuser');
  }
};

const redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/');
  }
  next();
};

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
      return new Handlebars.SafeString(JSON.stringify(obj));
    },
    partialsDir: ['views/partials/']
  }
});

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(
  session({
    name: 'AuthenticationState',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 15 * 60 * 1000 }
  })
);
app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

// Apply global authentication middleware for certain routes
app.use(async (req, res, next) => {
 
  if (req.session.isAuthenticated === undefined) {
    req.session.isAuthenticated = false;
  }
  // Log request info
  const logInfo = `[${new Date().toUTCString()}]: ${req.method} ${
    req.originalUrl
  } (${
    req.session.isAuthenticated
      ? `Authenticated ${
          req.session.user && req.session.user.email
            ? `Email: ${req.session.user.email}`
            : "User"
        }`
      : "Non-Authenticated"
  })`;
  
  console.log(logInfo);

  next();
});

app.use('/login', redirectIfAuthenticated);
app.use('/companies', isAuthenticated);
app.use('/questions', isAuthenticated);
//app.use('/users', isAuthenticated);

// Import and configure routes
configRoutes(app);

// Start the server
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
