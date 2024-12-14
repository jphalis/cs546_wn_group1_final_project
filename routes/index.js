// This file will import both route files and export the constructor method

import { static as staticDir } from 'express'
import companyRoutes from './companies.js'
import loginRoutes from './login.js'
import userRoutes from './users.js'

const constructorMethod = app => {
  const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
      return next()
    } else {
      return res.redirect('/login/signinuser')
    }
  }

  const redirectIfAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
      return res.redirect('/') 
    }
    next()
  }

  app.use('/public', staticDir('public'))

  app.use('/login', redirectIfAuthenticated, loginRoutes) 
  app.get('/generic/home', (req, res) => {
    res.render('generic/home', {  isAuthenticated: req.session.user  }) 
  })

  app.use('/createQuestion', isAuthenticated, tempRoutes)
  app.use('/companies', isAuthenticated, companyRoutes)
  app.use('/users', userRoutes) 
  app.use('/questions', isAuthenticated, questionRoutes)

  app.get('/', (req, res) => {
    return res.redirect('/generic/home') 
  })

  app.use('*', (req, res) => {
    if (req.session && req.session.user) {
      return res.redirect('/');  
    } else {
      return res.redirect('/login/signinuser'); 
    }
  })
}

export default constructorMethod
