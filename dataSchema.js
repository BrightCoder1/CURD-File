const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
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
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
});


const secretKey = process.env.SECRETKEY;
userSchema.methods.generateToken = async function (){
    try {
        const token = await jwt.sign({
        _id:this._id.toString(),
        },
        secretKey
        ,
        {
            expiresIn:"1d"
        }
    );
    this.tokens = this.tokens.concat({token:token});
    await this.save();
    // console.log("Generate Token: ", token);

    return token;
    } catch (error) {
        console.log(error);
    }
}


const DataUser =new mongoose.model("CURD_Data",userSchema);

module.exports = DataUser;