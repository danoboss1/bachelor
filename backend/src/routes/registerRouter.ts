import express from 'express';
import { RegisterController } from '../controllers/registerController.js';

const router = express.Router();

router.post('/', RegisterController.register);

export default router;