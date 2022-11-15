const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

//still need to determine better structure
const userSchema = mongoose.Schema({
    username: String,
    password:  {
        type: String,
        required: true,
      },
    name: String,
    serialNumber: String
});

 userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  // will encrypt password everytime its saved
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  
  const User = mongoose.model("user-info", userSchema);
  
  
  module.exports = User;