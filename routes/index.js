// This file will import both route files and export the constructor method

import path from 'path'
import { static as staticDir } from 'express'
import userRoutes from './users.js'
import tempRoutes from './temp_paths.js'

const constructorMethod = app => {
  app.get('/about', (req, res) => {
    res.sendFile(path.resolve('static/about.html'))
  })
  app.use('/public', staticDir('public'))
  app.use('/users', userRoutes)
  app.use('/createQuestion', tempRoutes)
  app.use('*', (req, res) => {
    res.sendFile(path.resolve('static/index.html'))
    // return res.status(404).json({ error: 'Not found' })
    // res.redirect('/posts');
  })
}

export default constructorMethod