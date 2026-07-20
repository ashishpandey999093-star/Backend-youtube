// require('dotenv').config({path: './.env'});

import dotenv from "dotenv";
import connectDB from "./db/index.js"

 

connectDB();










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