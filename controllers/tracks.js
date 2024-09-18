const express = require('express');
const router = express.Router();
// require all essential modules at the top of each controller

const Playlist = require('../models/playlist.js');

router.post("/", async function (req, res) {
    try {
      const playlist = await Playlist.findById(req.params.playlistId);
      const newTrack = {
        artstName: req.body.artstName,
        trackName: req.body.trackName,
        genre: req.body.genre,   
        youtubeLink: req.body.youtubeLink,
      };
      playlist.track.push(newTrack);
      await playlist.save();
      res.redirect(`/playlist/${playlist._id}`);
    } catch (err) {
      res.status(400).send("Error adding review");
    }
  });

module.exports = router;
// exports your routers for use in server.js