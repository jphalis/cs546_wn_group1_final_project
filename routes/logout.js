//import express, express router as shown in lecture code
import { Router } from 'express';

const router = Router()


  router.route('/').get(async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Could not log out. Please try again.');
      }
      res.clearCookie('AuthenticationState'); 
      res.redirect('/login/signinuser'); 
    });
  });
  

export default router
