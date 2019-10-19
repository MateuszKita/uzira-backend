import {Request, Response, Router} from 'express';
import {BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND} from 'http-status-codes';
import {IUserDTO, User} from '../mongoose/user.mongoose';

const router = Router();

/******************************************************************************
 *                      Get All Users / Specific User - "GET /api/users/:id?"
 ******************************************************************************/

router.get('/', async (req: Request, res: Response) => {
    try {
        if (req.params.id) {
            const user = User.findById(req.params.id);
            res.send(user);
        } else {
            const users = await User.find({});
            res.send(users);
        }
    } catch (e) {
        res.status(INTERNAL_SERVER_ERROR).send(e);
    }
});

/******************************************************************************
 *                       Add One - "POST /api/users/"
 ******************************************************************************/

router.post('/', async (req: Request, res: Response) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(CREATED).send(user);
    } catch (e) {
        console.error(e);
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                       Update - "PUT /api/users/:id"
 ******************************************************************************/

router.patch('/:id', async (req: Request, res: Response) => {
    const updates = Object.keys(req.body).length > 0 ? Object.keys(req.body) : [];
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) && updates.length > 0;

    if (!isValidOperation) {
        return res.status(BAD_REQUEST).send({error: 'Invalid updates!'});
    }

    try {
        const user: IUserDTO | null = await User.findById(req.params.id);
        if (user) {
            updates.forEach((update) => (user as any)[update] = req.body[update]);
            await user.save();
        } else {
            return res.status(NOT_FOUND).send();
        }
        res.send(user);
    } catch (e) {
        res.status(BAD_REQUEST).send(e);
    }
});

/******************************************************************************
 *                    Delete - "DELETE /api/users/:id"
 ******************************************************************************/

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(NOT_FOUND).send();
        }
        res.send(user);
    } catch (e) {
        res.status(INTERNAL_SERVER_ERROR).send();
    }
});

export default router;
