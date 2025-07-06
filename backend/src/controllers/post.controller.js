import asyncHandler from "express-async-handler";
import Post from '../models/post.model.js'
import User from "../models/User.model.js"
import { getAuth } from "@clerk/express"
import cloudinary from "../config/cloudinary.js"
import notification from "../models/notification.model.js";

import Comment from "../models/comment.model.js"

export const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("user", "username firstName lastName profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username firstName lastName profilePicture",
            },
        });

    res.status(200).json({ posts });
})


export const getpost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId)
        .populate("user", "username firstName lastName profilePicture")
        .populate({
            path: "comment",
            populate: {
                path: "user",
                select: "username firstName last Name profilePicture",
            },
        });

    if (!post) return res.status(404).json({ error: "post not found" })

    res.status(200).json({ post });
});

export const getUserPosts = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "user not found" });

    const post = await Post.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate("user", "username firstName lastName prifilePicture")
        .populate({
            path: "comment",
            populate: {
                path: "user",
                select: "username firstName lastName profilePicture",
            },
        });

    res.status(200).json({ post })
});

export const createPost = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { content } = req.body;
    const imageFile = req.file;

    // if non of these is provided
    if (!content && !imageFile) {
        return res.status(400).json({ error: "post must contain either text or image" });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    let imageUrl = "";


    // upload image to cloudinary if provided
    if (imageFile) {
        try {
            // convert buffer to base64 forcloudinary
            const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;

            const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                folder: "social_media_posts",
                resource_type: "image",
                transformation: [
                    { width: 800, hight: 600, crop: "limit" },
                    { quality: "auto" },
                    { format: "auto" },
                ],
            });
            imageUrl = uploadResponse.secure_url;

        } catch (uploadError) {
            console.error("cloudinary upload error:", uploadError);
            return res.status(400).json({ error: "failed to upload image" })

        }
    }

    const post = await post.create({
        user: user._id,
        content: content || "",
        image: imageUrl
    });

    res.status(201).json({ post });

});

export const likePost = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { postId } = req.params;

    const user = await User.findOne({ clerkId: userId });
    const Post = await Post.findById(postId);

    if (!user || !Post) return res.status(404).json({ error: "User or post not found" });


    const isliked = Post.likes.includes(user._id);
    


    if (isliked){
        // unlike
        await Post.findByIdAndUpdate(postId,{
            $pull: {likes:user._id}
        });
    }else{
        // like
        await Post .findByIdAndUpdate(postId,{
            $push:{likes: user._id}
        });

        // create notification if not liking own post
        if (Post.user.toString() !==user._id.toString()){
            await notification.create({
                form: user._id,
                to: Post.user,
                type:"like",
                Post:postId
            });
        }
    }

    res.status(200).json({
        message:isliked ? "post unlike successfully" : "post liked succesfully",
    })
});

export const deletePost =asyncHandler(async(req,res) => {
    const {userId} = getAuth(req);
    const {postId} = req.params;

    const user = await User.findOne({clerkId:userId});
    const post = await Post.findById(postId);

    if (!user || !post) return res.status(404).json({error : "user or post not found"});

    if (post.user.toString() !==user._id.toString()) {
        return res.status(403).json({error: "you can only delet your own posts"});
    }

    // delet all comment on this post
    await Comment.deleteMany({post:postId});

    // delet the post
    await post.findByIdAndDelete(postId);

    res.status(200).json({message:"post deleted successfully"});
})

// export default router;
