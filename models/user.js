const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: String,
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;