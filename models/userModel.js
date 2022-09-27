const mongoose = require('mongoose')

let userRole =  {
    ADMIN : "admin",
    USER : "user"
}

const userSchema = mongoose.Schema({

   name : {
    type : String,
    require: true
   },
    age : {
        type : Number,
        trim: true
    },

    email : {
        type : String,
        unique : true,
        require : true , 
        trim: true
    },

    password : {
        type : String,
        require : true,
        trim: true
    }
    ,

    address : {
        type : String
    },

    role : {
        type : String,
        enum : userRole,
        default : userRole.USER
    },

    otp : {
        type : Number,
    }

})

let userModel = mongoose.model("user" , userSchema)

module.exports = {userModel } 