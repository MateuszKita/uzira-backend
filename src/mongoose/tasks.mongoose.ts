import {Schema, Model, model} from 'mongoose';
import {IProjectDTO} from '../models/projects.model';

export const genericTaskSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    estimation: {
        type: Number,
        required: false
    },
    assigned: {
        type: Number
    },
    sprint: {
        type: String
    },
    description: {
        type: String,
        required: true
    }
});

export const taskSchema: Schema = new Schema({
    ...genericTaskSchema,
    subtasks: [genericTaskSchema],
    parent: genericTaskSchema || null,
});

export const Task: Model<IProjectDTO> = model('Task', taskSchema);
export const GenericTask: Model<IProjectDTO> = model('GenericTask', genericTaskSchema);
