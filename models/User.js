const mongoose=require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema=new mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    password:String,
    bie:String,
    picture:String,
    birthdate:Date,
    
});
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  });
  userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,10)
    }
    next();
})
module.exports=mongoose.model('users',userSchema)