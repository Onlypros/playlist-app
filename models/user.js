const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
   },
  tracks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    // unique: true,
  }]
});    

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  playlists: [playlistSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;