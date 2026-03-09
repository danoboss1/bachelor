import express from 'express';
import { UserController } from '../controllers/userController.js';
import authMiddleware from '../controllers/authMiddleware.js';

const router = express.Router();

router.get('/:userId', UserController.getUser);
router.post('', UserController.createUser);

router.put('/:userId', authMiddleware, UserController.updateUser);
router.put('/:userId/password', authMiddleware, UserController.updatePassword);

router.delete('/:userId', authMiddleware, UserController.deleteUser);

export default router;