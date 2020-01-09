import {Request, Response, Router} from 'express';
import {BAD_REQUEST, NOT_FOUND} from 'http-status-codes';
import {IAuthorizedRequest, IUser} from '../models/users.model';
import {auth} from '../middleware/authorization';
import {Project} from '../mongoose/projects.mongoose';
import {User} from '../mongoose/users.mongoose';
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
 *                      Remove Specific Project - "DELETE /projects/:projectId"
 ******************************************************************************/

router.delete('/:projectId', auth, async (req: Request, res: Response) => {
    try {
        const projectId = req.params.projectId;
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
 *                      Get users belonging to project / Specific User - "GET /projects/:projectId/users"
 ******************************************************************************/

router.get('/:projectId/users', auth, async (req: Request, res: Response) => {
    try {
        const projectId = req.params.projectId;
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
 *                      Add user to project / Specific User - "POST /projects/:projectId/users/:userId"
 ******************************************************************************/

router.post('/:projectId/users/:userId', auth, async (req: Request, res: Response) => {
    try {
        const {projectId, userId} = req.params;
        const user = (req as any as IAuthorizedRequest).user;
        const project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});
        const newUser = await User.findOne({_id: userId});
        if (project && newUser) {
            const newUserObject: IUser = (newUser as any).toObject();
            const projectUsers: IUser[] = project.toObject().users;

            console.log('newUserObject', newUserObject);
            console.log('projectUsers', projectUsers);

            if (projectUsers.map((u) => u._id.toHexString()).some((uId) => uId === newUserObject._id.toHexString())) {
                return res.status(BAD_REQUEST).send({message: `User '${newUserObject.name} is already in this project'`});
            }

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
 *                      Remove user from project / Specific User - "DELETE /projects/:projectId/users/:userId"
 ******************************************************************************/

router.delete('/:projectId/users/:userId', auth, async (req: Request, res: Response) => {
    try {
        const {projectId, userId} = req.params;
        const user = (req as any as IAuthorizedRequest).user;
        const project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});
        if (project) {
            const projectUsers: IUser[] = project.toObject().users;
            if (projectUsers.length <= 1) {
                return res.status(BAD_REQUEST).send({message: 'This is the last user in project, it can\'t be deleted'});
            }
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
            res.status(NOT_FOUND).send({message: 'Could not find project with given id'});
        }
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                      Get project backlog / Specific User - "GET /projects/:projectId/backlog"
 ******************************************************************************/

router.get('/:projectId/backlog', auth, async (req: Request, res: Response) => {
    try {
        const projectId = req.params.projectId;
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
 *                      Add task to project backlog / Specific User - "POST /projects/:projectId/backlog/"
 ******************************************************************************/

router.post('/:projectId/backlog', auth, async (req: Request, res: Response) => {
    try {
        const projectId = req.params.projectId;
        const user = (req as any as IAuthorizedRequest).user;
        const project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});
        if (project) {
            const projectBacklog: IProjectBacklog = project.toObject().backlog;
            const taskObject: ITask = req.body;
            taskObject.projectId = projectId;
            taskObject.status = 'open';
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
