import bodyParser from 'body-parser';
import { Router } from 'express';
import path from 'path';
import users from '../data/users.js';

const router = Router();
const __dirname = path.resolve();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.get('/', (req, res) => {
    if (req.session && req.session.user) {
        res.redirect('/dashboard');
    } else {
        const filePath = path.join(__dirname, 'static/loginPages', 'login.html');
        res.sendFile(filePath, (err) => {
            if (err) {
                res.status(500).send('File not found or server error.');
            }
        });
    }
}).post('/login', (req, res) => {
   // const { username, password } = req.body;
    
    
    const user = users.getUserById(u => u.username === username);
    //need to change by looking up username in users table
  
   if (user && user.password === password) {
   if(req.body){
      req.session.user = { username: user.username };
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
}
  });


export default router;



