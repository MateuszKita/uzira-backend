import {Request, Response, Router} from 'express';
import {BAD_REQUEST, CREATED} from 'http-status-codes';
import {User} from '../mongoose/users.mongoose';

const router = Router();

/******************************************************************************
 *                       Create User - "POST /sprints/"
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

export default router;
