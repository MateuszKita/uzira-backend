import {logger} from './logger';

const paramMissingError = 'One or more of the required parameters was missing.';

export const lg = (err: Error) => {
    if (err) {
        logger.error(err);
    } else {
        console.error(paramMissingError);
    }
};
