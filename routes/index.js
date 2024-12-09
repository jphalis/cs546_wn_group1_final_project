// This file will import both route files and export the constructor method

import { static as staticDir } from 'express'
import companyRoutes from './companies.js'
import dashboardRoutes from './dashboard.js'
import loginRoutes from './login.js'
import tempRoutes from './temp_paths.js'
import userRoutes from './users.js'

const constructorMethod = app => {
  app.use('/public', staticDir('public'))
  app.use('/users', userRoutes)
  app.use('/createQuestion', tempRoutes)
  app.use('/login', loginRoutes)
  app.use('/companies', companyRoutes)
  app.use('/dashboard', dashboardRoutes)
  app.get('/', (req, res) => {
    res.render('generic/home', {})
  })
  app.use('*', (req, res) => {
    res.redirect('/')
  })
}

export default constructorMethod
