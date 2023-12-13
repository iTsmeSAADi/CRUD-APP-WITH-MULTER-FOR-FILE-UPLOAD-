// user_route.js
import express from 'express';
import upload from '../config/multer.config.js';
import { load_index, load_users } from '../controllers/view.controller.js';
import UserController from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', load_index);

router.get('/add_users', load_users);

router.post('/update/:id', UserController.update_user)
router.post('/delete/:id', UserController.delete_user)


// Use .single('image') for a single file upload
router.post('/add', upload.single('image'), UserController.add_user);

export default router;
