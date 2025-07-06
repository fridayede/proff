import express from "express"
import {createPost, getPosts,getpost,getUserPosts,likePost, deletePost } from "../controllers/post.controller.js";
import { protectRoute} from "../middleware/auth.middleware.js"

import upload from "../middleware/Upload.middlewareware.js";

const router = express.Router()

// public route
router.get("/",getPosts);
router.get("/:postId",getpost);
router.get("/user/:username",getUserPosts);

// prtected route
router.post("/",protectRoute,upload.single("image"),createPost);
router.post("/:postId/Like",protectRoute,likePost)
router.delete("/:postId",protectRoute, deletePost);


export default router;