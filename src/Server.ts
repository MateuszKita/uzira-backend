import express from 'express';
import BaseRouter from './routes';
import {connectToMongo} from './db/mongoose';
import cors from 'cors';
import cookieParser = require('cookie-parser');

const app = express();

const allowedOrigins = ['https://uzira.netlify.com/', 'http://localhost:3000'];

app.use(cors({
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
    methods: 'GET, PUT, POST, DELETE, PATCH, OPTIONS'
}));

app.use(cookieParser());

app.use('', BaseRouter);

connectToMongo().then(() => {
    console.log('SUCCESS: Connected to MongoDB');
});

export default app;
