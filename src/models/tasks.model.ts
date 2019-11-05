import {ISimpleUser} from './users.model';
import {ObjectId} from 'mongodb';

export interface ITask {
    _id: ObjectId;
    name: string;
    type: string;
    estimation: number;
    assigned: ISimpleUser;
    projectId: string;
    description: string;
    subtasks?: ITask;
    parent?: ITask;
}
