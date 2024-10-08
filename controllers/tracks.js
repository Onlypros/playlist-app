const express = require('express');
const router = express.Router();
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

router.put('/add/:playlistId', async (req, res) => {
    console.log(req.session)  
    const user = await User.findById(req.session.user._id);
    console.log(user, 'user')
    const playlist = user.playlists.id(req.params.playlistId);
    console.log(playlist, 'playlist')
    const track = await Track.findById(req.body.trackId)
    console.log(track, 'track')
    console.log(req.body, 'req.body')
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

router.delete('/:trackId/remove/:playlistId/:index', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    const playlist = user.playlists.id(req.params.playlistId);
    const track = await Track.findById(req.params.trackId)
    const index = req.params.index
    try {
        playlist.tracks.splice(index, 1);
        await user.save();
        if (!playlist.tracks.includes(track._id)) {
            track.playlists.remove(playlist._id);
            await track.save();
        }
        res.redirect(`/users/${user._id}/playlists/${playlist._id}`);
    } catch (error) {
        console.log(error)
        res.redirect(`/users/${user._id}/playlists/${playlist._id}`);
    }
})

router.delete('/:trackId/delete/:playlistId', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    const playlist = user.playlists.id(req.params.playlistId);
    const track = await Track.findById(req.params.trackId)
    try {
        playlist.tracks.remove(track._id)
        await user.save();
        await Track.findByIdAndDelete(track._id);
        res.redirect(`/users/${user._id}/playlists/${playlist._id}`);
    } catch (error) {
        console.log(error)
        res.redirect(`/users/${user._id}/playlists/${playlist._id}`);
    }
})

module.exports = router;
