import express from 'express';
import { UserController } from '../controllers/userController.js';

const router = express.Router();

router.get('/:userId', UserController.getUser);
router.post('', UserController.createUser);
router.put('/:userId', UserController.updateUser);
router.delete('/:userId', UserController.deleteUser);

export default router;