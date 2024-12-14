// This file will import both route files and export the constructor method

import { static as staticDir } from 'express';
import companyRoutes from './companies.js';
import loginRoutes from './login.js';
import logoutRoutes from './logout.js';
import questionRoutes from './questions.js';
import userRoutes from './users.js';

const constructorMethod = (app) => {
  app.use('/public', staticDir('public'));

  app.use('/login', loginRoutes); 
  app.use('/logout', logoutRoutes); 
  app.get('/generic/home', (req, res) => {
    res.render('generic/home', { isAuthenticated: req.session.user });
  });

  app.use('/companies', companyRoutes);
  app.use('/users', userRoutes);
  app.use('/questions', questionRoutes);

  app.get('/', (req, res) => {
    return res.redirect('/generic/home');
  });

  app.use('*', (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (req.session && req.session.user) {
      return res.redirect('/');
    } else {
      return res.redirect('/login/signinuser');
    }
  });
};

export default constructorMethod;
