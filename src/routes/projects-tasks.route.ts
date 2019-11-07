import {Request, Response, Router} from 'express';
import {BAD_REQUEST} from 'http-status-codes';
import {auth} from '../middleware/authorization';

const router = Router();

/******************************************************************************
 *                      Get task details / Specific User - "GET /projects/:projectId/tasks/:taskId"
 ******************************************************************************/

router.get('/:projectId/tasks/:taskId', auth, async (req: Request, res: Response) => {
    try {
        const {projectId, taskId} = req.params;

        res.send();
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
