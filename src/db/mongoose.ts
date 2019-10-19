import {connect} from 'mongoose';

export const connectToMongo = async () => {
    const mongoUrl = process.env.MONGODB_URI;

    console.log('mongoUrl', mongoUrl);
    //
    // if (mongoUrl) {
    //     try {
    //         await connect(mongoUrl, {
    //             useNewUrlParser: true,
    //             useCreateIndex: true,
    //             useFindAndModify: false
    //         });
    //     } catch (e) {
    //         console.log('Could not connect to MongoDB', e);
    //     }
    // } else {
    //     console.error('Could not read MongoDB URL');
    // }

    const options = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        autoIndex: false, // Don't build indexes
        reconnectTries: 30, // Retry up to 30 times
        reconnectInterval: 500, // Reconnect every 500ms
        poolSize: 10, // Maintain up to 10 socket connections
        // If not connected, return errors immediately rather than waiting for reconnect
        bufferMaxEntries: 0
    };

    const connectWithRetry = async () => {
        console.log('MongoDB connection with retry');
        await connect(mongoUrl as string, options).then(() => {
            console.log('MongoDB is connected');
        }).catch((err) => {
            console.log('MongoDB connection unsuccessful, retry after 5 seconds.', err);
            setTimeout(connectWithRetry, 5000);
        });
    };

    await connectWithRetry();
};
