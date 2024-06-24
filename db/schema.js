const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema =new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
});

// secret key
const key = "vishalisagoodcoder";

// create a token function
userSchema.methods.generateToken = async function(){
    try {
        const token = await jwt.sign({
            _id:this._id.toString(),
        },
        key,
        {
            expiresIn:"1d"
        }
    );
    this.tokens = this.tokens.concat({token:token});
    await this.save();
    return token;
    } catch (error) {
        console.log("token error",error);
    }
}

const Register =new mongoose.model("CURD",userSchema);


module.exports = Register;