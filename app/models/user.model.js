const mongoose = require('mongoose')

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    lastLogin: Date,
    isMuted: Boolean
  }, { timestamps: true })
)

module.exports = User
