import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import BaseRouter from './routes';
import mongodb from 'mongodb';

// Init express
const app = express();

// Add middleware/settings/routes to express.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', BaseRouter);

// lets require/import the mongodb native drivers.

// We need to work with "MongoClient" interface in order to connect to a mongodb server.
const MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.

// (Focus on This Variable)
// const url = process.env.MONGODB_URI;
const url = 'mongodb://heroku_2sknn3th:72ee7mkebona7r0ksl01847oaq@ds211648.mlab.com:11648/heroku_2sknn3th';
// (Focus on This Variable)

// Use connect method to connect to the Server
MongoClient.connect(url, (err, db) => {
    if (err) {
        // tslint:disable-next-line:no-console
        console.error('Unable to connect to the mongoDB server. Error:', err);
    } else {
        // do some work here with the database.
        // Close connection
        db.close();
    }
});

const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Export express instance
export default app;
