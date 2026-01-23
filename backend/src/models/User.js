const mongoose=require("mongoose");

const userSchema=new mongoose.Schema(
    {name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    passwordHash:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["OWNER","VIEWER","EDITOR"],
        default:"OWNER"
    },
    weddingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Wedding"
    },
    // Profile fields
    partnerName:{
        type:String,
        trim:true
    },
    weddingDate:{
        type:Date
    },
    venue:{
        type:String,
        trim:true
    },
    budget:{
        type:Number
    },
    guestCount:{
        type:Number
    },
    phone:{
        type:String,
        trim:true
    },
    address:{
        type:String,
        trim:true
    }

},
{timestamps:true}
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ weddingId: 1 });

module.exports=mongoose.model("User",userSchema);