import {Schema, Model, model} from 'mongoose';
import {IProjectDTO} from '../models/projects.model';

const GenericTaskSchema: Schema = new Schema({
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
    status: {
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
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: 'Task'
    },
    status: {
        type: String,
        required: true
    },
    estimation: {
        type: Number,
        required: false,
        default: 0
    },
    assigned: {
        type: Number,
        default: null
    },
    projectId: {
        type: String,
        required: true
    },
    sprint: {
        type: String,
        required: false,
        default: null
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
