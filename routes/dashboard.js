import { Router } from 'express';
import path from 'path';

const router = Router();
const __dirname = path.resolve(); 

router.get('/', (req, res) => {
        const filePath = path.join(__dirname, 'static/loginPages', 'dashboard.html');
        res.sendFile(filePath, (err) => {
            if (err) {
                res.status(500).send('File not found or server error.');
            }
        });
});


export default router;