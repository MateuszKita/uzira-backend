import {Schema, Model, model} from 'mongoose';
import {IProjectDTO} from '../models/projects.model';

export const projectSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sprints: [{
        innerId: {
            type: Number,
            required: true
        },
        active: {
            type: Boolean,
            required: true,
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        tasks: ['Task']
    }],
    users: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        id: {
            type: String,
            required: true,
        }
    }],
    backlog: {
        tasks: ['GenericTask']
    }
});

// projectSchema.virtual('tasks', {
//     ref: 'Task',
//     localField: '_id',
//     foreignField: 'owner'
// });

projectSchema.pre('remove', async function(next) {
    const project = this;
    // await Task.deleteMany({owner: user._id});
    next();
});

export const Project: Model<IProjectDTO> = model('Project', projectSchema);
