import {Request, Response, Router} from 'express';
import {BAD_REQUEST, NOT_FOUND} from 'http-status-codes';
import {IAuthorizedRequest, IUser} from '../models/users.model';
import {auth} from '../middleware/authorization';
import {Project} from '../mongoose/projects.mongoose';
import {User} from '../mongoose/users.mongoose';
import {ISprint} from '../models/sprints.model';
import {IProjectBacklog} from '../models/projects.model';
import {Task} from '../mongoose/tasks.mongoose';
import {ITask} from '../models/tasks.model';

const router = Router();

/******************************************************************************
 *                       Create Project - "POST /projects/"
 ******************************************************************************/

router.post('/', auth, async (req: Request, res: Response) => {
    try {
        const user = (req as any as IAuthorizedRequest).user;
        const project = new Project({
            ...req.body,
            sprints: [],
            users: [
                {
                    email: user.email,
                    name: user.name,
                    _id: user._id
                }
            ],
            backlog: {
                tasks: []
            }
        });
        await project.save();
        res.send(project);
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                       Get Projects - "GET /projects/"
 ******************************************************************************/

router.get('/', auth, async (req: Request, res: Response) => {
    try {
        const user = (req as any as IAuthorizedRequest).user;
        let projects = await Project.find({users: {$elemMatch: {_id: user._id}}});
        projects = projects.map((project) => {
            project = project.toObject();
            delete project.users;
            delete project.sprints;
            delete project.backlog;
            return project;
        });
        res.send(projects);
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                      Remove Specific Project - "DELETE /projects/:id"
 ******************************************************************************/

router.delete('/:id', auth, async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;
        let project;
        if (projectId) {
            const user = (req as any as IAuthorizedRequest).user;
            project = await Project.findOneAndDelete({_id: projectId, users: {$elemMatch: {_id: user._id}}});
        } else {
            throw new Error('No project ID provided in URL parameter');
        }
        res.send(project ? {message: `Successfully deleted project with name: ${project.name}`} : 'No project deleted');
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                      Get users belonging to project / Specific User - "GET /projects/:id/users"
 ******************************************************************************/

router.get('/:id/users', auth, async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;
        const user = (req as any as IAuthorizedRequest).user;
        const project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});
        if (project) {
            const projectUsers = project.toObject().users;
            res.send(projectUsers);
        } else {
            res.status(NOT_FOUND).send();
        }
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                      Add user to project / Specific User - "POST /projects/:id/users/:userId"
 ******************************************************************************/

router.post('/:id/users/:userId', auth, async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;
        const userId = req.params.userId;
        const user = (req as any as IAuthorizedRequest).user;
        const project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});
        const newUser = await User.findOne({_id: userId});
        if (project && newUser) {
            const newUserObject: IUser = (newUser as any).toObject();
            const projectUsers: IUser[] = project.toObject().users;
            const newUsers: IUser[] = [...projectUsers, newUserObject];
            await project.update({
                ...project.toObject(),
                users: newUsers
            });
            await project.save();
            res.send({
                message: `Updated project \'${project.toObject().name}\' by adding user: \'${newUserObject.name}\'`
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
 *                      Remove user from project / Specific User - "DELETE /projects/:id/users/:userId"
 ******************************************************************************/

router.post('/:id/users/:userId', auth, async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;
        const userId = req.params.userId;
        const user = (req as any as IAuthorizedRequest).user;
        const project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});
        if (project) {
            const projectUsers: IUser[] = project.toObject().users;
            const newUsers: IUser[] = projectUsers.filter((projectUser) => projectUser._id !== userId);
            await project.update({
                ...project.toObject(),
                users: newUsers
            });
            await project.save();
            res.send({
                message: `Removed user from project \'${project.toObject().name}\'`
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

/******************************************************************************
 *                      Get project backlog / Specific User - "GET /projects/:id/backlog"
 ******************************************************************************/

router.get('/:id/backlog', auth, async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;
        const user = (req as any as IAuthorizedRequest).user;
        const project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});
        if (project) {
            const projectBacklog = project.toObject().backlog;
            res.send(projectBacklog);
        } else {
            res.status(NOT_FOUND).send();
        }
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                      Add task to project backlog / Specific User - "POST /projects/:id/sprints/"
 ******************************************************************************/

router.post('/:id/sprints', auth, async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;
        const user = (req as any as IAuthorizedRequest).user;
        const project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});
        if (project) {
            const projectBacklog: IProjectBacklog = project.toObject().backlog;
            const taskObject: ITask = req.body;
            const task = new Task(taskObject);
            await task.save();
            const taskWithId: ITask = (await Task.findOne(taskObject) as any).toObject();
            await project.update({
                ...project.toObject(),
                backlog: {
                    tasks: [
                        ...projectBacklog.tasks,
                        taskWithId
                    ]
                }
            });
            await project.save();
            res.send({
                message: `Updated project \'${project.toObject().name}\' backlog by adding task: \'${taskObject.name}\'`
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
