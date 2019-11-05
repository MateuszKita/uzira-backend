import {Router} from 'express';
import UsersRouter from './users.route';
import ProjectsRouter from './projects.route';
import SprintsRouter from './sprints.route';
import TasksRouter from './tasks.route';

const router = Router();

router.use('/users', UsersRouter);
router.use('/projects', ProjectsRouter);
router.use('/sprints', SprintsRouter);
router.use('/tasks', TasksRouter);

export default router;
