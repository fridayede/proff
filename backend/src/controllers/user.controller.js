// import { User } from "@clerk/express";
import User from "../models/User.model.js"
// import Notification from "../models/notification.model.js"
import Notification from "../models/notification.model.js"
import asyncHandler from "express-async-handler"
import { clerkClient, getAuth } from "@clerk/express";
// import { Profiler } from "react";


export const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ Error: "user not found;" });

    res.status(200).json({ user });
})

export const updateProfile = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, { new: true })

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ user });
})





export const syncUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req)

    // check if user already exsit in mongodb
    const exsitingUser = await User.findOne({ clerkId: userId });
    if (exsitingUser) {
        return res.status(200).json({ user: exsitingUser, message: "User already exists" });
    }


    // creat new user from clerk data
    const clerkUser = await clerkClient.users.getUser(userId);

    const userData = {
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        username: clerkUser.emailAddresses[0].emailAddress.split("@")[0],
        ProfilePicture: clerkUser.imageUrl || "",
    };

    const user = await User.create(userData);
});


export const getCurrentUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req)
    const user = await User.findOne({ clerkId: userId });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ user });
})


export const followUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { targetUserId } = req.params;

    if (userId === targetUserId) return res.status(400).json({ error: "You cannot follow yourself" });

    const CurrentUser = await User.findOne({ clerkId: userId });
    const targetUser = await User.findById({ targetUserId });

    if (!CurrentUser || !targetUser) return res.status(404).json({ error: "User not found" });

    const isFollowing = CurrentUser.following.includes(targetUserId);

    if (isFollowing) {
        // unfollow
        await User.findByIdAndUpdate(CurrentUser._id, {
            $pull: { following: targetUserId },
        });
        await User.findByIdAndUpdate(targetUserId, {
            $pull: { followers: CurrentUser._id },
        });
    } else {
    //    follow
    await User.findByIdAndUpdate(CurrentUser._id,{
        $push: {following:targetUserId},
    });
    await User.findByIdAndUpdate(targetUserId,{
        $push:{followers:CurrentUser._id},
    });

    // creat notification
    await Notification.create({
        from: CurrentUser._id,
        to:targetUserId,
        type:"follow",
    });
    }

    res.status(200).json({
        message: isFollowing ? "User unfollowed succcessfully" : "User followed successfully",
    })
})