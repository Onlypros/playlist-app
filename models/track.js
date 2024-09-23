const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    artistName: {
        type: String,
        required: true,
    },
    trackName: {
        type: String,
        required: true,
    },
    playlists: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist',
    }]
});


const Track = mongoose.model('Track', trackSchema);

module.exports = Track;