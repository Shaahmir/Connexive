import User from '../Models/userModel.js';
import Meeting from '../Models/meetingModel.js';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import crypto from 'crypto';

const userRegister = async (req, res) => {
    let {name, username, password} = req.body;
    
    try {
        
        if( !name || !username || !password ) {
            return res.status(httpStatus.BAD_REQUEST).json({message: "Please fill all credentials"});
        }
        
        username = username.toLowerCase();

        const existingUser = await User.findOne({username});

        if( existingUser ){
            return res.status(httpStatus.FOUND).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        await user.save();
        return res.status(httpStatus.CREATED).json({message: "User registered"});

    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: `Some error occured ${e}`});
    }
}

const userLogin = async (req, res) => {
    let {username, password} = req.body;

    if (! username || ! password) {
        return res.status(httpStatus.BAD_REQUEST).json({message: "Please fill all credentials"});
    }

    try {
        username = username.toLowerCase();
        const user = await User.findOne({username});

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({message: "No user found"});
        }

        const isAuthorized = await bcrypt.compare(password, user.password);

        if (isAuthorized) {
            
            if (!user.token) {
                const token = crypto.randomBytes(20).toString("hex");
                user.token = token;
                user.save();
            }

            return res.status(httpStatus.OK).json(user);
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({message: "Email or Password is incorrect!"});
        }

    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: `Some error occured, ${e}`});
    }
}

const getHistory = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({token});
        const history = await Meeting.find({userId: user.username});
        return res.status(httpStatus.OK).json(history);

    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: `Some error occured, ${e}`});
    }
}

const setHistory = async (req, res) => {
    const { token, meetingCode } = req.body;

    try {
        const user = await User.findOne({token});

        const newMeeting = new Meeting ({
            userId: user.username,
            meetingId: meetingCode,
        })

        await newMeeting.save();
        return res.status(httpStatus.CREATED).json({message: "Added to history"});

    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: `Some error occured, ${e}`});
    }
}

export {userRegister, userLogin, getHistory, setHistory}