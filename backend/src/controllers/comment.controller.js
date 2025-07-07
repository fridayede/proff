import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import comment from "../models/comment.model.js";
import post from "../models/post.model.js";
import User from "../models/User.model.js";
import notification from "../models/notification.model.js";
// import post from "../models/post.model.js";
// import { populate } from "dotenv";


export const getComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const comments = await comment.find({ post: postId })
        .sort({ createAt: -1 })
        .populate("user", "username firstName lastName profilePicture");

    res.status(200).json({ comments });
});


export const createComment = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req)
    const { postId } = req.params;
    const { content } = req.body;


    if (!content || !content.trim() === "") {
        return res.status(400).json({ error: "Comment content is required" });
    }


    const user = await User.findOne({ clerkId: userId });
    const post = await post.findById(postId);

    if (!user || !post) return res.status(404).json({ error: "User or post not found" });

    const comment = await comment.create({
        user: user._id,
        post: postId,
        content,
    });


    // link the comment to the post 
    await post.findByIdAndUpdate(postId, {
        $push: { comments: comment._id },
    });


    // creat notification if not commenting on own post 
    if (post.User.toString() !== user._id.toString()) {
        await notification.create({
            from: user._id,
            to: post.user,
            types: "comment",
            post: postId,
            comment: comment._id,
        });
    }
    res.status(201).json({comment})
});

export const deleteComment = asyncHandler(async(req,res) =>{
    const {userId} = getAuth(req);
    const {commentId} = req.params;

    const user = await User.findOne({clerkId:userId});
    const comment = await Comment.findById(commentId);

    if(!user || !comment){
        return res.status(404).json({error:"user or comment not found"});
    }

    if (comment.user.toString() !== user._id.toString()){
        return res.status(403).json({error:"You can only delecte your own contents"});
    }

    // remove comment from post
    await post.findByIdAndUpdate(comment.post,{
        $pull:{comments:commentId},
    });

    // delete the Comment
    await Comment.findByIdAndDelete(commentId)

    res.status(200).json({message:"Comment deleted successfully"});
})