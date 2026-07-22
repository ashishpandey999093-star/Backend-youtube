// require('dotenv').config({path: './.env'});

import dotenv from "dotenv";
import connectDB from "./db/index.js"
import { app } from "./app.js";
 

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Error: ",error);
        throw error;
    })
    app.listen(process.env.PORT||4000,()=>{
        console.log(`server  is running at port: ${process.env.PORT||4000}`);
    })
})
.catch((err)=>{
    console.log("MONGODB connection FAILED ", err);
})










/*
 (async () => {
    try {
        await mongoose.connect(`${process.env.
            MONGODB_URI}/${DB_NAME}`);
        app.on("error",(error)=>{
            console.log("ERROR", error);
            throw error;
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Server is listening on port $
                {process.env.PORT}`);
        })

    } catch (err) {
        console.error("error: ", err);
        throw err;
    }
})();
*/