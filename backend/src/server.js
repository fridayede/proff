import express from "express";
import cors from "cors"
import{clerkMiddleware} from "@clerk/express"

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import  UserRoutes from "./routes/User.route.js";
import  PostRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js"
import notification from "./routes/notification.route.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";


const app = express();

app.use(cors())
app.use(express.json())



app.use(clerkMiddleware());
app.use(arcjetMiddleware);

app.get("/",(req,res)=> res.send("Hello from  server"))

app.use("/api/user",UserRoutes);
app.use("/api/posts",PostRoutes);
app.use("/api/comment",commentRoutes);
app.use("/api/notification",notification);


// error handling middleware 
app.use((err,req,res, next) =>{
 console.error("unhandled error:",err);
 res.status(500).json({error:err.message || "internal server error"});
});


// app.listen(ENV.PORT, ()=> console.log("server is up and running good on PORT:", ENV.PORT));



const startServer = async () => {
    try {
        await connectDB();
        
        app.get("/", (req, res) => res.send("Hello server"))
        //listen for local development
        // app.listen(ENV.PORT, () => console.log("server is up and running good on PORT:", ENV.PORT));
        if (ENV.NODE_ENV  !=="production"){
            app.listen(ENV.PORT, () => console.log("server is up and running good on PORT:", ENV.PORT));
        }
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
//export for vercel 
export default app