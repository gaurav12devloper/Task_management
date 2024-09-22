import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    matchPassword(enteredPassword: string): Promise<boolean>;
}
const userSchema = new mongoose.Schema<IUser>({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
},
{
    timestamps: true,
});

userSchema.methods.matchPassword = async function(enteredPassword: string):Promise<boolean>{
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre<IUser>('save', async function(next){ //middleware, it is used to hash the password before saving it to the database
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const userModel=mongoose.model("user", userSchema);
export default userModel;
