const mongoose=require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema=new mongoose.Schema({
    firstname:String,
    lastname:String,
    email: {
      type: String,

      unique: true,
    
  },
    password:String,
   
  
    birthdate:Date,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
  }
    
});
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  });

module.exports=mongoose.model('users',userSchema)