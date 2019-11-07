import {ITask} from './tasks.model';
import {ObjectId} from 'mongodb';

export interface ISprint {
    _id: ObjectId;
    index: number;
    active: boolean;
    startDate: string;
    endDate: string;
    tasks: ITask[];
}
