import {logger} from '@shared';
import {Request, Response, Router} from 'express';
import {BAD_REQUEST, INTERNAL_SERVER_ERROR, OK} from 'http-status-codes';
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

router.post('/add', async (req: Request, res: Response) => {
    try {
        // const { user } = req.body;
        // if (!user) {
        //     return res.status(BAD_REQUEST).json({
        //         error: paramMissingError,
        //     });
        // }
        // await userDao.add(user);
        // return res.status(CREATED).end();
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

/******************************************************************************
 *                       Update - "PUT /api/users/:id"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
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

router.delete('/delete/:id', async (req: Request, res: Response) => {
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
