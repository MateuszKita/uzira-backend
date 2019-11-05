import {Request, Response, Router} from 'express';
import {BAD_REQUEST} from 'http-status-codes';
import {IAuthorizedRequest} from '../models/users.model';
import {auth} from '../middleware/authorization';
import {Project} from '../mongoose/projects.mongoose';

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
                    name: user.name,
                    id: user._id
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
        const projects = await Project.find({users: {$elemMatch: {_id: user._id}}});
        res.send(projects);
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                      Get info about User / Specific User - "GET /users/me"
 ******************************************************************************/

// router.get('/me', auth, async (req: Request, res: Response) => {
//     res.send((req as any as IAuthorizedRequest).user);
// });

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
