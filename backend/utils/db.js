import mongoose from "mongoose";
import dns from "node:dns";  //added to resolve DNS issues with MongoDB connection
dns.setServers(["8.8.8.8", "8.8.4.4"]);  // Set DNS servers to Google's public DNS, to solve potential DNS resolution issues
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); 
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        // process.exit(1);
    }
};
export default connectDB;