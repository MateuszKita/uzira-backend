import {Router} from 'express';
import UserRouter from './users.route';

const router = Router();

router.use('/users', UserRouter);

export default router;
