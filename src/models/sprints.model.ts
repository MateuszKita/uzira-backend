import {ObjectId} from 'mongodb';
import {ITask} from './tasks.model';

export interface ISprint {
    _id: ObjectId;
    active: boolean;
    startDate: string;
    endDate: string;
    tasks: ITask[];
}
