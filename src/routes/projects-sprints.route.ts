import {Request, Response, Router} from 'express';
import {BAD_REQUEST, NOT_FOUND} from 'http-status-codes';
import {Project} from '../mongoose/projects.mongoose';
import {IAuthorizedRequest, IUser} from '../models/users.model';
import {auth} from '../middleware/authorization';
import {ISprint} from '../models/sprints.model';

const router = Router();

/******************************************************************************
 *                      Get sprints belonging to project / Specific User - "GET /projects/:id/sprints"
 ******************************************************************************/

router.get('/:id/sprints', auth, async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;
        const user = (req as any as IAuthorizedRequest).user;
        const project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});
        if (project) {
            const projectSprints = project.toObject().sprints;
            res.send(projectSprints);
        } else {
            res.status(NOT_FOUND).send();
        }
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                      Add sprint to project / Specific User - "POST /projects/:id/sprints/"
 ******************************************************************************/

router.post('/:id/sprints', auth, async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;
        const user = (req as any as IAuthorizedRequest).user;
        const project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});
        if (project) {
            const projectSprints: ISprint[] = project.toObject().sprints;
            let sprintIndex = 1;
            if (projectSprints.length > 0) {
                sprintIndex = Math.max(...projectSprints.map((sprint) => sprint.index)) + 1;
            }
            const newSprints: IUser[] = [...projectSprints, {
                ...req.body,
                index: sprintIndex
            }];
            await project.update({
                ...project.toObject(),
                sprints: newSprints
            });
            await project.save();
            res.send({
                message: `Updated project \'${project.toObject().name}\' by adding sprint: \'Sprint ${sprintIndex}\'`
            });
        } else {
            res.status(NOT_FOUND).send();
        }
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

export default router;
