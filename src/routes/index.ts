import {Router} from 'express';
import UserRouter from './users.route';
import ProjectRouter from './projects.route';

const router = Router();

router.use('/users', UserRouter);
router.use('/projects', ProjectRouter);

export default router;
