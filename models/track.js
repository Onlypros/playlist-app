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
trackSchema.pre('save', function(next) {
    // Ensure that the playlists array contains only unique entries
    this.playlists = [...new Set(this.playlists.map(id => id.toString()))];
    next();
});

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;