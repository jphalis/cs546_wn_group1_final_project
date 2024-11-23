import { Router } from 'express'
let router = Router()
import bcrypt from 'bcrypt'
import { usersData } from '../data/index.js'
import validations from '../validations.js'


  router
  .route('/')
  .get((req, res) => {
    try {
      
      res.render('users/createQuestion')
    } catch (e) {
      return res.status(500).send(e)
    }
  })


export default router
