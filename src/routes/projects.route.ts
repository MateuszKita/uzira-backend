import {Request, Response, Router} from 'express';
import {BAD_REQUEST} from 'http-status-codes';
import {IAuthorizedRequest} from '../models/users.model';
import {auth} from '../middleware/authorization';
import {Project} from '../mongoose/projects.mongoose';
import {IProject} from '../models/projects.model';

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
                    innerId: user._id
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
        let projects = await Project.find({users: {$elemMatch: {innerId: user._id}}});
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
            project = await Project.findOneAndDelete({_id: projectId, users: {$elemMatch: {innerId: user._id}}});
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
 *                      Log out User / Specific User - "POST /users/logout?"
 ******************************************************************************/

// router.post('/logout', auth, async (req: Request, res: Response) => {
//     try {
//         const authorizedRequest: IAuthorizedRequest = (req as any as IAuthorizedRequest);
//         authorizedRequest.user.tokens = authorizedRequest.user.tokens.filter((token) => {
//             return token.token !== authorizedRequest.token;
//         });
//         await authorizedRequest.user.save();
//
//         res.send();
//     } catch (e) {
//         console.error(e);
//         res.status(INTERNAL_SERVER_ERROR).send(e);
//     }
// });

/******************************************************************************
 *                      Log all User everywhere - "POST /users/logoutAll?"
 ******************************************************************************/

// router.post('/logoutAll', auth, async (req: Request, res: Response) => {
//     try {
//         const authorizedRequest: IAuthorizedRequest = (req as any as IAuthorizedRequest);
//         authorizedRequest.user.tokens = [];
//         await authorizedRequest.user.save();
//         res.send();
//     } catch (e) {
//         console.error(e);
//         res.status(INTERNAL_SERVER_ERROR).send(e);
//     }
// });

/******************************************************************************
 *                       Update User - "PATCH /users/:id"
 ******************************************************************************/

// router.patch('/:id', auth, async (req: Request, res: Response) => {
//     const updates = Object.keys(req.body).length > 0 ? Object.keys(req.body) : [];
//     const allowedUpdates = ['name', 'email', 'password', 'age'];
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) && updates.length > 0;
//
//     if (!isValidOperation) {
//         return res.status(BAD_REQUEST).send({error: 'Invalid updates!'});
//     }
//
//     try {
//         const authorizedUser: IUserDTO = (req as any as IAuthorizedRequest).user;
//         if (authorizedUser) {
//             updates.forEach((update) => (authorizedUser as any)[update] = req.body[update]);
//             await authorizedUser.save();
//         } else {
//             return res.status(NOT_FOUND).send();
//         }
//         res.send(authorizedUser);
//     } catch (e) {
//         res.status(BAD_REQUEST).send(e);
//     }
// });

/******************************************************************************
 *                    Delete - "DELETE /users/:id"
 ******************************************************************************/

// router.delete('/me', auth, async (req: Request, res: Response) => {
//     try {
//         const authorizedUser: IUserDTO = (req as any as IAuthorizedRequest).user;
//         await authorizedUser.remove();
//         res.send(authorizedUser);
//     } catch (e) {
//         res.status(INTERNAL_SERVER_ERROR).send();
//     }
// });

export default router;
