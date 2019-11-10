import {Request, Response, Router} from 'express';
import {BAD_REQUEST, CONFLICT, NOT_FOUND} from 'http-status-codes';
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
                res.status(NOT_FOUND).send('Could not find task with given ID');
            }
        }
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                      Update task details / Specific User - "PATCH /projects/:projectId/tasks/:taskId"
 ******************************************************************************/

router.patch('/:projectId/tasks/:taskId', auth, async (req: Request, res: Response) => {
    try {
        const updates = Object.keys(req.body).length > 0 ? Object.keys(req.body) : [];
        const allowedUpdates = ['type', 'estimation', 'assigned', 'assigned', 'name', 'description', 'status'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) && updates.length > 0;

        if (!isValidOperation) {
            return res.status(BAD_REQUEST).send({error: 'Invalid updates!'});
        }

        const {projectId, taskId} = req.params;
        const user = (req as any as IAuthorizedRequest).user;
        const project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});

        if (!project) {
            return res.status(NOT_FOUND).send('Could not find project with given ID');
        }

        const taskIndexInBacklog = project.toObject().backlog.tasks
            .findIndex((task: ITask) => task._id.toHexString() === taskId);

        if (taskIndexInBacklog > -1) {
            const newBacklogTasks: ITask[] = project.toObject().backlog.tasks;
            const updatedTask: ITask = newBacklogTasks[taskIndexInBacklog];
            updates.forEach((update) => updatedTask[update] = req.body[update]);

            newBacklogTasks.splice(taskIndexInBacklog, 1, updatedTask);
            await project.update({
                ...project.toObject(),
                backlog: {
                    tasks: newBacklogTasks
                }
            });
            await project.save();
            res.send('Successfully removed task from sprint backlog');
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
                const newSprints: ISprint[] = project.toObject().sprints;
                const updatedTask: ITask = newSprints[sprintIndexWithTask].tasks[taskIndexInBacklog];
                updates.forEach((update) => updatedTask[update] = req.body[update]);

                newSprints[sprintIndexWithTask].tasks.splice(sprintIndexWithTask, 1, updatedTask);
                await project.update({
                    ...project.toObject(),
                    sprints: newSprints
                });
                await project.save();
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
 *                      Remove task / Specific User - "DELETE /projects/:projectId/tasks/:taskId"
 ******************************************************************************/

router.delete('/:projectId/tasks/:taskId', auth, async (req: Request, res: Response) => {
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
            const newBacklogTasks: ITask[] = project.toObject().backlog.tasks;
            newBacklogTasks.splice(taskIndexInBacklog, 1);
            await project.update({
                ...project.toObject(),
                backlog: {
                    tasks: newBacklogTasks
                }
            });
            await project.save();
            res.send('Successfully removed task from sprint backlog');
        } else {
            let taskIndexInSprint = -1;
            const sprintIndexWithTask = project.toObject().sprints
                .findIndex((sprint: any) => sprint.tasks
                    .some((task: ITask, index: number) => {
                        if (task._id.toHexString() === taskId) {
                            taskIndexInSprint = index;
                            return true;
                        } else {
                            return false;
                        }
                    })
                );
            if (sprintIndexWithTask > -1) {
                const newSprints: ISprint[] = project.toObject().sprints;
                newSprints[sprintIndexWithTask].tasks.splice(sprintIndexWithTask, 1);
                await project.update({
                    ...project.toObject(),
                    sprints: newSprints
                });
                await project.save();
                res.send(`Successfully removed task from Sprint ${newSprints[sprintIndexWithTask].index}`);
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
 * Move task from backlog/sprint to sprint / Specific User - "POST /projects/:projectId/tasks/:taskId/toSprint/:sprintId'"
 ******************************************************************************/

router.post('/:projectId/tasks/:taskId/toSprint/:sprintId', auth, async (req: Request, res: Response) => {
    try {
        const {projectId, taskId, sprintId} = req.params;

        const user = (req as any as IAuthorizedRequest).user;
        let project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});
        if (!project) {
            return res.status(NOT_FOUND).send('Could not find project with given ID');
        }

        const taskIndexInBacklog = project.toObject().backlog.tasks.findIndex((task: ITask) => task._id.toHexString() === taskId);
        let taskToMove: ITask | null = null;

        let currentSprintWithTask: ISprint | null = null;

        if (taskIndexInBacklog > -1) {
            const newBacklogTasks: ITask[] = project.toObject().backlog.tasks;
            taskToMove = newBacklogTasks[taskIndexInBacklog];
            newBacklogTasks.splice(taskIndexInBacklog, 1);
            await project.update({
                ...project.toObject(),
                backlog: {
                    tasks: newBacklogTasks
                }
            });
            await project.save();
        } else {
            let currentSprintWithTaskIndex: number = -1;
            currentSprintWithTask = project.toObject().sprints
                .findIndex((s: any, index: number) => s.tasks.some((t: ITask) => {
                        if (t._id.toHexString() === taskId) {
                            currentSprintWithTaskIndex = index;
                            return true;
                        } else {
                            return false;
                        }
                    })
                );
            if (currentSprintWithTaskIndex > -1 && currentSprintWithTask) {
                const newSprints: ISprint[] = project.toObject().sprints;
                newSprints[currentSprintWithTaskIndex].tasks.splice(currentSprintWithTaskIndex, 1);
                await project.update({
                    ...project.toObject(),
                    sprints: newSprints
                });
            } else {
                return res.status(NOT_FOUND).send('Could not find task with given ID');
            }
        }

        project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});

        if (!project) {
            return res.status(NOT_FOUND).send('Could not find project with given ID');
        }

        let sprintIndex: number = -1;
        const sprint: ISprint = project.toObject().sprints.find((s: any, index: number) => {
            if (s._id.toHexString() === sprintId) {
                sprintIndex = index;
                return true;
            } else {
                return false;
            }
        });

        if (currentSprintWithTask && sprint._id.toHexString() === currentSprintWithTask._id.toHexString()) {
            return res.status(CONFLICT).send({message: 'This task is already in this sprint'});
        }

        if (sprintIndex > -1) {
            if (!taskToMove) {
                return res.status(NOT_FOUND).send('Could not find task with given ID');
            }

            const newSprints: ISprint[] = project.toObject().sprints;
            taskToMove.sprint = sprintId;
            newSprints[sprintIndex].tasks = [...newSprints[sprintIndex].tasks, taskToMove];
            await project.update({
                ...project.toObject(),
                sprints: newSprints
            });
            await project.save();
            res.send(`Successfully moved task '${taskToMove.name}' from ${taskIndexInBacklog > 1 ? 'backlog' : 'another sprint'} to 'Sprint ${sprint.index}'`);
        } else {
            res.status(NOT_FOUND).send('Could not find sprint with given ID');
        }
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
        const {projectId, taskId} = req.params;

        const user = (req as any as IAuthorizedRequest).user;
        let project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});

        if (!project) {
            return res.status(NOT_FOUND).send('Could not find project with given ID');
        }

        let taskToMove: ITask | null = null;
        let taskIndex: number = -1;
        const currentSprintWithTaskIndex: number = project.toObject().sprints
            .findIndex((s: any, index: number) => s.tasks.some((t: ITask) => {
                if (t._id.toHexString() === taskId) {
                    taskIndex = index;
                    return true;
                } else {
                    return false;
                }
            }));

        if (currentSprintWithTaskIndex > -1 && taskIndex > -1) {
            const newSprints: ISprint[] = project.toObject().sprints;
            taskToMove = newSprints[currentSprintWithTaskIndex].tasks[taskIndex];
            newSprints[currentSprintWithTaskIndex].tasks.splice(taskIndex, 1);
            await project.update({
                ...project.toObject(),
                sprints: newSprints
            });
            await project.save();
            if (!taskToMove) {
                return res.status(NOT_FOUND).send('Could not find task with given ID');
            }
        } else {
            return res.status(NOT_FOUND).send('Could not find task with given ID');
        }

        project = await Project.findOne({_id: projectId, users: {$elemMatch: {_id: user._id}}});

        if (!project) {
            return res.status(NOT_FOUND).send('Could not find project with given ID');
        }

        taskToMove.sprint = null;
        const newBacklogTasks: ITask[] = [...project.toObject().backlog.tasks, taskToMove];
        await project.update({
            ...project.toObject(),
            backlog: {
                tasks: newBacklogTasks
            }
        });
        await project.save();
        res.send(`Successfully moved task '${taskToMove.name}' from Sprint ${project.toObject().sprints[currentSprintWithTaskIndex].index} to Backlog`);
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

export default router;
