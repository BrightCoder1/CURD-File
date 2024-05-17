const mongoose = require("mongoose");
const url = process.env.URL;

const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log("DB Connect success full");
        
    } catch (error) {
        console.log("DB error:", error);
    }
}

module.exports = connectDB;