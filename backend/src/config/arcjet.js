import arcjet,{tokenBucket,shield,detectBot} from "@arcjet/node"
import {ENV} from "./env.js"

// initialize Arcjet with security rules 
export const aj =arcjet({
    key:ENV.ARCJET_KEY,
    characteristics:["ip.src"],
    rules:[
        // shield protect your app from common attack e.g. SQL injecction,XSS ,CSRF attack
        shield({mode:"LIVE"}),
        

        // bot dectation -block all bots except search engines
        detectBot({
            mode:"LIVE",
            allow:["CATEGORY:SEARCH_ENGINE"],
        }),

        // rate limiting with token bucket algorithm
        tokenBucket({
            mode:"LIVE",
            refillRate:10,// token added per interver
            interval:10, //interval in seconds (10 seconds)
            capacity:15, //maximum token in bucket
        }),
    ],

});