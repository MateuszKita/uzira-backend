import {Request, Response, Router} from 'express';
import {BAD_REQUEST, NOT_FOUND} from 'http-status-codes';
import {Project} from '../mongoose/projects.mongoose';
import {IAuthorizedRequest, IUser} from '../models/users.model';
import {auth} from '../middleware/authorization';
import {ISprint} from '../models/sprints.model';

const router = Router();

/******************************************************************************
 *                      Get sprints belonging to project / Specific User - "GET /projects/:projectId/sprints"
 ******************************************************************************/

router.get('/:projectId/sprints', auth, async (req: Request, res: Response) => {
    try {
        const projectId = req.params.projectId;
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
 *                      Add sprint to project / Specific User - "POST /projects/:projectId/sprints/"
 ******************************************************************************/

router.post('/:projectId/sprints', auth, async (req: Request, res: Response) => {
    try {
        const projectId = req.params.projectId;
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

/******************************************************************************
 *                      Get sprint details / Specific User - "POST /projects/:projectId/sprints/:sprintId"
 ******************************************************************************/

router.get('/:projectId/sprints/:sprintId', auth, async (req: Request, res: Response) => {
    try {
        const user = (req as any as IAuthorizedRequest).user;
        const {projectId, sprintId} = req.params;
        const project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});

        if (!project) {
            return res.status(NOT_FOUND).send('Could not find project with given ID');
        }

        const sprint = (project.toObject().sprints as ISprint[])
            .find((projectSprint: ISprint) => projectSprint._id.toHexString() === sprintId);

        return sprint
            ? res.send(sprint)
            : res.status(NOT_FOUND).send('Could not find sprint with given ID');

    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                      Update sprint details / Specific User - "PATCH /projects/:projectId/sprints/:sprintId"
 ******************************************************************************/

router.patch('/:projectId/sprints/:sprintId', auth, async (req: Request, res: Response) => {
    const updates = Object.keys(req.body).length > 0 ? Object.keys(req.body) : [];
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) && updates.length > 0;

    try {
        const user = (req as any as IAuthorizedRequest).user;
        const {projectId, sprintId} = req.params;

        if (!isValidOperation) {
            return res.status(BAD_REQUEST).send({error: 'Invalid updates!'});
        }

        const project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});

        if (!project) {
            return res.status(NOT_FOUND).send('Could not find project with given ID');
        }

        let sprintIndex = 0;
        const sprint: ISprint | undefined = (project.toObject().sprints as ISprint[])
            .find((projectSprint: ISprint, index) => {
                if (projectSprint._id.toHexString() === sprintId) {
                    sprintIndex = index;
                    return true;
                } else {
                    return false;
                }
            });

        if (!sprint) {
            return res.status(NOT_FOUND).send('Could not find sprint with given ID');
        }

        const newSprintsList: ISprint[] = project.toObject().sprints;
        updates.forEach((update) => sprint[update] = req.body[update]);
        newSprintsList.splice(sprintIndex, 1, sprint);

        await project.update({
            ...project.toObject(),
            sprints: newSprintsList
        });
        await project.save();

        console.log(1111111111111111111111111, project.toObject());

        res.send({message: `Sprint ${sprint.index} updated!`});

    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                      Remove sprint / Specific User - "DELETE /projects/:projectId/sprints/:sprintId"
 ******************************************************************************/

router.delete('/:projectId/sprints/:sprintId', auth, async (req: Request, res: Response) => {
    try {
        const user = (req as any as IAuthorizedRequest).user;
        const {projectId, sprintId} = req.params;

        res.send();
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                      Add task to sprint / Specific User - "DELETE /projects/:projectId/sprints/:sprintId"
 ******************************************************************************/

router.post('/:projectId/sprints/:sprintId', auth, async (req: Request, res: Response) => {
    try {
        const user = (req as any as IAuthorizedRequest).user;
        const {projectId, sprintId} = req.params;

        res.send();
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

export default router;
