import momgoose from "mongoose";

const commentSchema = new momgoose.Schema(
    {
        user: {
            type: momgoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: momgoose.Schema.Types.ObjectId,
            ref: "post",
            required: true,
        },
        content: {
            type: String,
            required: true,
            maxLength: 280,
        },
        likes:[
            {
                type:momgoose.Schema.Types.ObjectId,
                ref:"User",
            },
        ],
    },
    {timestamps:true}
);

const comment = momgoose.model("comment", commentSchema);

export default Comment;