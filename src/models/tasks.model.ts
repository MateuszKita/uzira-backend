import {ObjectId} from 'mongodb';
import {ISimpleUser} from './users.model';

export interface ITask {
    _id: ObjectId;
    name: string;
    type: string;
    estimation: number;
    assigned: ISimpleUser;
    projectId: ObjectId | null;
    description: string;
    status: string;
    sprint: ObjectId | null;
    subtasks: ITask[];
    parent: ObjectId | null;

    [key: string]: ObjectId | string | number | ISimpleUser | null | ITask[];
}
