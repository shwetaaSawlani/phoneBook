require('dotenv').config()
import connectDB from "./db/db";
import { app } from "./app";

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MongoDb coonection fail !!!!", err);
})

