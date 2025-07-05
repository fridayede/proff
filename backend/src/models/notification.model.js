import mongoose from "mongoose"

const notification = new mongoose.Schema(
    {
        form: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["follow", "like", "comment"],
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post",
            default: null,
        },
        Comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment",
            default: null,
        },

    },
    {timestamps:true}
);

export default notification;