import express from "express";
import cors from "cors"
import{clerkMiddleware} from "@clerk/express"

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import  UserRoutes from "./routes/User.route.js";
import  PostRoutes from "./routes/post.route.js";

const app = express();

app.use(cors())
app.use(express.json())



app.use(clerkMiddleware());

app.get("/",(req,res)=> res.send("Hello from  server"))

app.use("/api/user",UserRoutes);
app.use("/api/posts",PostRoutes);


// error handling middleware 
app.use((err,req,res) =>{
 console.error("unhandled error:",err);
 res.status(500).json({error:err.message || "internal server error"});
});


// app.listen(ENV.PORT, ()=> console.log("server is up and running good on PORT:", ENV.PORT));



const startServer = async () => {
    try {
        await connectDB();
        
        app.get("/", (req, res) => res.send("Hello server"))
        
        app.listen(ENV.PORT, () => console.log("server is up and running good on PORT:", ENV.PORT));
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();