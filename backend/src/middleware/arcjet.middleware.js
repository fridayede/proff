import { aj } from "../config/arcjet.js";

//Arcjet middleware for rate limiting, bot protection, and security
export const arcjetMiddleware =async(req,res,next)=>{
    try {
        const decision = await aj.protect(req,{
            requested:1 //each request consumes 1 token
        });

        //handle denied requests
        if (decision.isDenied()){
            if (decision.reason.isRateLimit()){
             return res.status(429).json({
                error:"Too many requests",
                message:"Rate limit exceeded.please try again later"
             });
            }else if(decision.reason.isBot()){
             return res.status(403).json({
                error:"Bot access denied",
                message:"Automated request are not allowed",
             });
            }else{
                return res.status(403).json({
                    error:"forbidden",
                    message:"Access denied by security policy"
                });
            }
        }

        // check for spoofed bots
        if (decision.results.some((result)=> result.reason.isBot() && result.reason.isSpoofed())){
         return res.status(403).json({
            error:"spoofed bot dectected",
            message:"Malicious bot activity detected"
         });
        }
    next();
    } catch (error) {
      console.error("Arcjet middleware error:",error);

      //allow request to continue if Arcjet fails
      next();
      
       
    }
}