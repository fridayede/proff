import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();



app.get("/",(req,res)=> res.send("Hello server"))



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