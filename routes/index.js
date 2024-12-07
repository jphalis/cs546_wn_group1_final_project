// This file will import both route files and export the constructor method

import path from 'path'
import { static as staticDir } from 'express'
import userRoutes from './users.js'
import tempRoutes from './temp_paths.js'
import companyRoutes from './companies.js'

const constructorMethod = app => {
  app.use('/public', staticDir('public'))
  app.use('/users', userRoutes)
  app.use('/createQuestion', tempRoutes)
  app.use('/companies', companyRoutes)
  app.get('/', (req, res) => {
    res.render('generic/home', {})
  })
  app.use('*', (req, res) => {
    res.redirect('/')
  })
}

export default constructorMethod
