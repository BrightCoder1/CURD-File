const mongoose = require("mongoose");
const URL = "mongodb://127.0.0.1:27017/Intro_CURD";


const connectDB = async ()=>{
    try {
        await mongoose.connect(URL);
        console.log("DataBase Connect Successfull...");
    } catch (error) {
        console.log(error);        
    }
}

module.exports = connectDB;