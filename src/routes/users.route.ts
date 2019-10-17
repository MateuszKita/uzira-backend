import {logger} from '@shared';
import {Request, Response, Router} from 'express';
import {BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, OK} from 'http-status-codes';
import {User} from '../mongoose/user.mongoose';

const router = Router();

/******************************************************************************
 *                      Get All Users - "GET /api/users/"
 ******************************************************************************/

router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(INTERNAL_SERVER_ERROR).send();
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

router.put('/:id', async (req: Request, res: Response) => {
    try {
        // const { user } = req.body;
        // if (!user) {
        //     return res.status(BAD_REQUEST).json({
        //         error: paramMissingError,
        //     });
        // }
        // user.id = Number(user.id);
        // await userDao.update(user);
        // return res.status(OK).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

/******************************************************************************
 *                    Delete - "DELETE /api/users/:id"
 ******************************************************************************/

router.delete('/:id', async (req: Request, res: Response) => {
    // try {
    //     await userDao.delete(Number(req.params.id));
    //     return res.status(OK).end();
    // } catch (err) {
    //     logger.error(err.message, err);
    //     return res.status(BAD_REQUEST).json({
    //         error: err.message,
    //     });
    // }
});

export default router;
