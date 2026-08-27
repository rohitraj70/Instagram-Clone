import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;  //destructuring the request body to get username, email, and password
        // Logic for user registration
        if(!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }
        const user = await User.findOne({ email }); // Check if the user already exists
        if (user) {
            return res.status(400).json({ message: "User already exists", success: false });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword }); // Create a new user
        return res.status(201).json({ message: "User registered successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(401).json({ message: "All fields are required", success: false });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found", success: false });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid credentials", success: false });
        }
        user = {
            _id : user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: user.posts,
            user
        }
        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });
        return res.cookie("token", token, { httpOnly: true,sameSite: 'strict', secure: true, maxAge: 1*24*60*60*1000 }).status(200).json({
                 message: `Welcome back, ${user.username}!`, success: true});
    } catch (error) {
        console.log(error);
    }
};

export const logout = async(_,res)=>{
    try {
        return res.cookie("token","",{maxAge:0}).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        
    }

};

export const getProfile = async(req, res)=>{
    try {
        const userId = req.params.id;
        let user = await User.findById(userId);
        return res.status(200).json({
            user,
            success:true
        });
    } catch (error) {
        
    }
};

export const editProfile = async (req,res)=>{
    try { //created middlewares folder
        const userId = req.id;
        const{bio, gender} = req.body;
        const {profilePicture} = req.file;
        let cloudResponse;

        if(profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message: 'User not found.',
                success: false
            })
        };
        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile Updated',
            success: true,
            user
        });


        
    } catch (error) {
        console.log(error);
    }
};

export const getSuggestedUsers = async(req, res) =>{
    try {
        const suggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password");
        if(!suggestedUsers){
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200)({
            success: true,
            users:suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};
export const followOrUnfollow = async(req, res)=>{
    try {
        const followKarneWala = req.id;
        const jiskoFollowKarunga = req.params.id;
        if(followKarneWala === jiskoFollowKarunga){
            return res.status(400).json({
                message: 'You cant follow yourself',
                success: false
            });
        }
        const user = await User.findById(followKarneWala);
        const targetUser = await User.findById(jiskoFollowKarunga);
        if(!user || !targetUser){
            return res.status(400).json({
                message: 'User Not found',
                success:false
            });

        }
        


    } catch (error) {
        console.log(error);
    }
}