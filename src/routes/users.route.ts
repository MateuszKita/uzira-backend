import {Request, Response, Router} from 'express';
import {BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND} from 'http-status-codes';
import {User} from '../mongoose/user.mongoose';
import {IAuthorizedRequest, IUserDTO} from '../models/users.model';
import {auth} from '../middleware/authorization';
import cors from 'cors';

const router = Router();
const allowedOrigins = ['https://uzira.netlify.com/', 'http://localhost:3000'];

router.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar', 'Access-Control-Allow-Origin'],
    credentials: true,
    methods: 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}));

/******************************************************************************
 *                       Create User - "POST /users/"
 ******************************************************************************/

router.post('/', async (req: Request, res: Response) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();

        res.status(CREATED).send({user, token});
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                       Log In - "POST /users/login"
 ******************************************************************************/

router.post('/login', async (req: Request, res: Response) => {
    const user = await (User as any).findByCredentials(req.body.email, req.body.password);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                      Get info about User / Specific User - "GET /users/me"
 ******************************************************************************/

router.get('/me', auth, async (req: Request, res: Response) => {
    res.send((req as any as IAuthorizedRequest).user);
});

/******************************************************************************
 *                      Log out User / Specific User - "POST /users/logout?"
 ******************************************************************************/

router.post('/logout', auth, async (req: Request, res: Response) => {
    try {
        const authorizedRequest: IAuthorizedRequest = (req as any as IAuthorizedRequest);
        authorizedRequest.user.tokens = authorizedRequest.user.tokens.filter((token) => {
            return token.token !== authorizedRequest.token;
        });
        await authorizedRequest.user.save();

        res.send();
    } catch (e) {
        console.error(e);
        res.status(INTERNAL_SERVER_ERROR).send(e);
    }
});

/******************************************************************************
 *                      Log all User everywhere - "POST /users/logoutAll?"
 ******************************************************************************/

router.post('/logoutAll', auth, async (req: Request, res: Response) => {
    try {
        const authorizedRequest: IAuthorizedRequest = (req as any as IAuthorizedRequest);
        authorizedRequest.user.tokens = [];
        await authorizedRequest.user.save();
        res.send();
    } catch (e) {
        console.error(e);
        res.status(INTERNAL_SERVER_ERROR).send(e);
    }
});

/******************************************************************************
 *                       Update User - "PATCH /users/:id"
 ******************************************************************************/

router.patch('/:id', auth, async (req: Request, res: Response) => {
    const updates = Object.keys(req.body).length > 0 ? Object.keys(req.body) : [];
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) && updates.length > 0;

    if (!isValidOperation) {
        return res.status(BAD_REQUEST).send({error: 'Invalid updates!'});
    }

    try {
        const authorizedUser: IUserDTO = (req as any as IAuthorizedRequest).user;
        if (authorizedUser) {
            updates.forEach((update) => (authorizedUser as any)[update] = req.body[update]);
            await authorizedUser.save();
        } else {
            return res.status(NOT_FOUND).send();
        }
        res.send(authorizedUser);
    } catch (e) {
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                    Delete - "DELETE /users/:id"
 ******************************************************************************/

router.delete('/me', auth, async (req: Request, res: Response) => {
    try {
        const authorizedUser: IUserDTO = (req as any as IAuthorizedRequest).user;
        await authorizedUser.remove();
        res.send(authorizedUser);
    } catch (e) {
        res.status(INTERNAL_SERVER_ERROR).send();
    }
});

export default router;
