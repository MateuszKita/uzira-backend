import {Router} from 'express';
import UsersRouter from './users.route';
import ProjectsRouter from './projects.route';
import ProjectsSprintsRouter from './projects-sprints.route';
import ProjectsTasksRouter from './projects-tasks.route';

const router = Router();

router.use('/users', UsersRouter);
router.use('/projects', ProjectsRouter);
router.use('/projects', ProjectsSprintsRouter);
router.use('/projects', ProjectsTasksRouter);

export default router;
