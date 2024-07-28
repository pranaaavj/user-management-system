const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//User Schema
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    maxlength: [20, 'First name cannot be more than 20 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    maxlength: [20, 'Last name cannot be more than 20 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
});
//Hash Password
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
//Compare Password
UserSchema.methods.comparePassword = async function (userPassword) {
  const isPassword = bcrypt.compare(userPassword, this.password);
  return isPassword;
};
//Generating JWT Token
UserSchema.methods.createJwt = function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.firstName,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

const User = mongoose.model('Users', UserSchema);

module.exports = User;
