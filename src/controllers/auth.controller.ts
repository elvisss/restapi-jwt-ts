import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
    const user: IUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    user.password = await user.encryptPassword(user.password);
    const savedUser = await user.save();
    // token
    const token:string = jwt.sign({_id: user._id, username: user.username}, process.env.TOKEN_SECRET || 'tokentest');

    res.header('token', token).json(savedUser);
}

export const signin = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) return res.status(400).json('Email or password incorrect');

        const correctPassword: boolean = await user.validatePassword(req.body.password);
        if (!correctPassword) return res.status(400).json('Invalid Password');

        const token: string = jwt.sign({_id: user._id, username: user.username}, process.env.TOKEN_SECRET || 'tokentest', {
            expiresIn: 60 * 60 * 24
        });

        return res.header('token', token).json(user);
    }
    catch (ex) {
        console.log(ex);
        return res.status(500).json('Interval Server Error')
    }
}

export const profile = async (req: Request, res: Response) => {
    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).json('User Not Found');
    res.json(user);
};
