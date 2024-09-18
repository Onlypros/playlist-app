const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    artstName: {
        type: String,
        required: true,
    },
    trackName: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    youtubeLink: {
        type: String,
    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    },
});

const playlistSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
     },
    tracks: [trackSchema]
  });    

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;