import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import { urlencoded } from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";

dotenv.config({});


const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req,res)=>{
    return res.status(200).json({
        message: "Server is running",
        success: true
    });
})


//Middlewares , compulsory in all the projects 
// app.use(cors());
app.use(cookieParser());  //token stored in cookie for authentication
app.use(express.json());
app.use(urlencoded({extended:true}));
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
}
app.use(cors(corsOptions));



app.listen(PORT, ()=> {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})