import {Schema, Model, model} from 'mongoose';
import {IProjectDTO} from '../models/projects.model';

export const GenericTaskSchema: Schema = new Schema({
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

export const TaskSchema: Schema = new Schema({
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
    },
    subtasks: {
        type: [GenericTaskSchema],
        default: []
    },
    parent: {
        type: GenericTaskSchema,
        default: null
    },
});

export const Task: Model<IProjectDTO> = model('Task', TaskSchema);
export const GenericTask: Model<IProjectDTO> = model('GenericTask', GenericTaskSchema);
