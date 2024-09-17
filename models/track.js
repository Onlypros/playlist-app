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
    },
    youtubeLink: {
        type: String,
    },
    playlistId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist' 
    }
});

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;