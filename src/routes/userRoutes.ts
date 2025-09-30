import express from 'express';
import { UserController } from '../controllers/userController.js';

const router = express.Router();

router.get('/:userId', UserController.getUser);

export default router;