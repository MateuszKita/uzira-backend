import {ISimpleUser} from './users.model';

export interface ITask {
    name: string;
    type: string;
    estimation: number;
    assigned: ISimpleUser;
    sprintId: string;
    description: string;
    subtasks?: ITask;
    parent?: ITask;
}
