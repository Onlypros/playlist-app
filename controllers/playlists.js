const express = require('express');
const router = express.Router();
// require all essential modules at the top of each controller
const Playlist = require('../models/playlist.js');

router.get('/new', async (req, res) => {
    res.render('playlists/new.ejs');
  });
 
router.get('/', async (req, res) => {
  try {
    const user = await Playlist.findById(req.session.user._id);
    res.render('playlists/index.ejs', {
      playlists: user.playlists
    })
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.post('/', async (req, res) => {
  try {
     // Step 1: Create a new playlist document
  const newPlaylist = await Playlist.create({
    name: req.body.name,
    description: req.body.description,
    tracks: req.body.tracks.map(trackId => mongoose.Types.ObjectId(trackId)) // assuming tracks is an array of ObjectId
  });
    const user = await Playlist.findById(req.session.user._id);
     user.playlists.push(req.body);
     await user.save();
     res.redirect('/playlists');
  } catch (error) {
    console.log(error);
    res.redirect('/playlists/new');
  }
})



try {
 



module.exports = router;
// exports your routers for use in server.js