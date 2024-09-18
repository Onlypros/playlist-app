const express = require('express');
const router = express.Router();
// require all essential modules at the top of each controller
const Track = require('../models/track.js');
const User = require('../models/user.js');

router.get('/new', async (req, res) => {
    res.render('tracks/new.ejs');
  });

router.post("/", async (req, res) => {
    console.log(req.body);
    try {
        await Track.create(req.body);
        res.redirect("/tracks/new");
    } catch (error) {
        console.log(error)
        res.redirect('/tracks/new');
    }
  });

  // routes below are for adding tracks into playlists
router.put('/add/:playlistId', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    const playlist = user.playlists.id(req.params.playlistId);
    const track = await Track.findById(req.body.trackId)
    if (playlist.tracks.includes(track._id)) return
    try {
        playlist.tracks.push(track._id);
        await user.save();
        track.playlists.push(playlist._id);
        await track.save();
        res.redirect(`/users/${user._id}/playlists/${playlist._id}`);
    } catch (error) {
        console.log(error)
        res.redirect(`/users/${user._id}/playlists/${playlist._id}`);
    }
});

router.delete('/:trackId/remove/:playlistId', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    const playlist = user.playlists.id(req.params.playlistId);
    const track = await Track.findById(req.params.trackId)
    try {
        playlist.tracks.remove(track._id);
        await user.save();
        track.playlists.remove(playlist._id);
        await track.save();
        res.redirect(`/users/${user._id}/playlists/${playlist._id}`);
    } catch (error) {
        console.log(error)
        res.redirect(`/users/${user._id}/playlists/${playlist._id}`);
    }
})



module.exports = router;
// exports your routers for use in server.js

// tracks refernce the fruti lesson