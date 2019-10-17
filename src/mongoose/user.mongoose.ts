import {hash} from 'bcryptjs';
import isEmail = require('validator/lib/isEmail');
import {Document, Schema, Model, model} from 'mongoose';
import {IUser} from '../models';

export interface IUserDTO extends IUser, Document {
    fullName(): string;
}

const rootThis = this;

export const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value: string) {
            const emailIsValid = isEmail(value);
            if (!emailIsValid) {
                throw new Error('Email is invalid');
            }
            return emailIsValid;
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value: string) {
            const passwordIncludesIncorrectWords = value.toLowerCase().includes('password');
            if (passwordIncludesIncorrectWords) {
                throw new Error('Password cannot contain "password"');
            }
            return !passwordIncludesIncorrectWords;
        }
    }
});

interface IUserDto extends IUser, Document {
}

UserSchema.pre('save', async function(next) {
    const user = this as IUserDto;
    if (user.isModified('password')) {
        user.password = await hash(user.password, 8);
    }
    next();
});

export const User: Model<IUserDTO> = model<IUserDTO>('User', UserSchema);
