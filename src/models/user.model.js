const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({

    email:{
        type: String,
        required:[true, "Email is required to create account"],
        trim: true,
        lowcase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Invalid email address"
        ],
        unique:[true, "Email already exists"]
    },

    name:{
        type: String,
        required:[true, "Name is required to create account"]
    },

    password:{
        type: String,
        required:[true, "Password is required to create account"],
        minlength:[6,"Password should contain minimum 6 characters"],
        select: false //koi v query mei it will not be called
    }

},{
    timestamps: true
})

//jab v user k data ko save krenge to usse pehle ye function chlega...agar user ka password change hua to hashing ho jaiga
//pre password ko hash mei convert kr k  database mei save kr dega 
userSchema.pre("save", async function(next){
       if(!this.isModified("password")){
        return next()
       }  // if password is not changed then return 

       const hash = await bcrypt.hash(this.password,10)
       this.password = hash
       return next()
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
    // this.password db mei saved rehta h or bcrypt user jo enter kiya h login k time pe or jo saved h dono ko compare krta h
}

const userModel = mongoose.model("user", userSchema);

module.exports = userModel