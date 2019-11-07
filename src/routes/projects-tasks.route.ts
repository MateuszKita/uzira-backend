import {Request, Response, Router} from 'express';
import {BAD_REQUEST, NOT_FOUND} from 'http-status-codes';
import {auth} from '../middleware/authorization';
import {IAuthorizedRequest} from '../models/users.model';
import {Project} from '../mongoose/projects.mongoose';
import {ITask} from '../models/tasks.model';
import {ISprint} from '../models/sprints.model';

const router = Router();

/******************************************************************************
 *                      Get task details / Specific User - "GET /projects/:projectId/tasks/:taskId"
 ******************************************************************************/

router.get('/:projectId/tasks/:taskId', auth, async (req: Request, res: Response) => {
    try {
        const {projectId, taskId} = req.params;
        const user = (req as any as IAuthorizedRequest).user;
        const project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});
        if (!project) {
            return res.status(NOT_FOUND).send('Could not find project with given ID');
        }

        const taskIndexInBacklog = project.toObject().backlog.tasks
            .findIndex((task: ITask) => task._id.toHexString() === taskId);

        if (taskIndexInBacklog > -1) {
            res.send(project.toObject().backlog.tasks[taskIndexInBacklog]);
        } else {
            let taskIdInSprint = -1;
            const sprintIndexWithTask = project.toObject().sprints
                .findIndex((sprint: any) => sprint.tasks
                    .some((task: ITask, index: number) => {
                        if (task._id.toHexString() === taskId) {
                            taskIdInSprint = index;
                            return true;
                        } else {
                            return false;
                        }
                    })
                );
            if (sprintIndexWithTask > -1) {
                res.send((project.toObject().sprints)[sprintIndexWithTask].tasks[taskIdInSprint]);
            } else {
                return res.status(NOT_FOUND).send('Could not find task with given ID');
            }
        }
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                      Update task details / Specific User - "GET /projects/:projectId/tasks/:taskId"
 ******************************************************************************/

router.patch('/:projectId/tasks/:taskId', auth, async (req: Request, res: Response) => {
    try {
        const {projectId, taskId} = req.params;

        res.send();
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                      Remove task / Specific User - "DELETE /projects/:projectId/tasks/:taskId"
 ******************************************************************************/

router.delete('/:projectId/tasks/:taskId', auth, async (req: Request, res: Response) => {
    try {
        const {projectId, taskId} = req.params;

        res.send();
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 * Move task from backlog to sprint / Specific User - "POST /projects/:projectId/tasks/:taskId/toSprint/:sprintId'"
 ******************************************************************************/

router.post('/:projectId/tasks/:taskId/toSprint/:sprintId', auth, async (req: Request, res: Response) => {
    try {
        const {projectId, taskId, sprintId} = req.params;

        res.send();
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 * Move task from sprint to backlog / Specific User - "POST /projects/:projectId/tasks/:taskId/toBacklog"
 ******************************************************************************/

router.post('/:projectId/tasks/:taskId/toBacklog', auth, async (req: Request, res: Response) => {
    try {
        const {projectId, taskId, sprintId} = req.params;

        res.send();
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

export default router;
