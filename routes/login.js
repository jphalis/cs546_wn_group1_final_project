//import express, express router as shown in lecture code
import { Router } from 'express';
import users from '../data/users.js';

const router = Router();

router.route('/').get(async (req, res) => {
  res.status(200).redirect('/signinuser');
});

router
  .route('/signupuser')
  .get(async (req, res) => {
    //code here for GET
    res.status(200).render('login/signupuser');

  })
  .post(async (req, res) => {
    //code here for POST
    console.log(JSON.stringify(req.body));
      let userInfo = await users.createUser (
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.passwordPlainText,
        req.body.phoneNumber,
        req.body.bio
      ) 
    console.log(userInfo);

    if (userInfo && userInfo.registrationCompleted === true) {
      req.session.user = userInfo;
      res.status(200).redirect('/login/signinuser');
    }

  });

router
  .route('/signinuser')
  .get(async (req, res) => {
    //code here for GET
    res.status(200).render('login/signinuser');
  })
  .post(async (req, res) => {
    try {
      console.log(JSON.stringify(req.body)); 
      let username = req.body.username;
      let password = req.body.password;
  
      let user = await users.signInUser(username, password);
  
      if (user) {
        req.session.user = user;
        res.status(200).redirect('/questions');
      } else {
        res.status(401).send('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while logging in.');
    }
  });
  
router.route('/signoutuser').get(async (req, res) => {
  //code here for GET
  req.session.user.destroy(err => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error logging out')
    }
    res.redirect('/login/signinuser')
  })
  
});

export default router;



