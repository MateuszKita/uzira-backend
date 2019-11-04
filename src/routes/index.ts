import {Router} from 'express';
import UserRouter from './users.route';
import cors from 'cors';
import app from '@server';

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

router.use('/users', UserRouter);

export default router;
