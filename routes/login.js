//import express, express router as shown in lecture code
import { Router } from 'express'
import users from '../data/users.js'

const router = Router()

router.route('/').get(async (req, res) => {
  res.status(200).redirect('/signinuser')
})

router
  .route('/signupuser')
  .get(async (req, res) => {
    //code here for GET
    res.status(200).render('login/signupuser')
  })
  .post(async (req, res) => {
    //code here for POST
    console.log(JSON.stringify(req.body))
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' })
    }
    try {
      let userInfo = await users.createUser(
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.password,
        req.body.phoneNumber,
        req.body.bio
      )
      console.log(userInfo)
      if (userInfo && userInfo.registrationCompleted === true) {
        req.session.user = userInfo
        res.status(200).redirect('/login/signinuser')
      }
    } catch (e) {
      return res.status(400).render('login/signupuser', { error: e })
    }
  })

router
  .route('/signinuser')
  .get(async (req, res) => {
    //code here for GET
    res.status(200).render('login/signinuser')
  })
  .post(async (req, res) => {
    try {
      console.log(JSON.stringify(req.body))
      let email = req.body.email
      let password = req.body.password

      let user = await users.signInUser(email, password)

      if (user) {
        req.session.user = user
        res.status(200).redirect('/questions')
      } else {
        res.status(401).send('Invalid credentials. Please try again.')
      }
    } catch (e) {
      console.error(e)
      return res.status(400).render('login/signinuser', { error: e })
    }
  })

router.route('/signoutuser').get(async (req, res) => {
  req.session.destroy()
  res.redirect('/login/signinuser')
})

export default router
