import express from "express"
import {createPost, getPosts,getpost,getUserPosts,likePost, deletePost } from "../controllers/post.controller";
import { ProtectRoute} from "../middleware/auth.middleware"
import upload from "../middleware/Upload.middlewareware";

const router = express.Router()

// public route
router.get("/",getPosts);
router.get("/:postId",getpost);
router.get("/user/:username",getUserPosts);

// prtected route
router.post("/",ProtectRoute,upload.single("image"),createPost);
router.post("/:postId/Like",ProtectRoute,likePost)
router.delete("/:postId",ProtectRoute, deletePost);


export default router;