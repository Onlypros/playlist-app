const express = require('express');
const router = express.Router();
// require all essential modules at the top of each controller
const User = require('../models/user.js');
const Track = require('../models/track.js');

router.get('/new', async (req, res) => {
    res.render('playlists/new.ejs');
  });

// controllers/applications.js

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render('playlists/index.ejs', {
      playlists: user.playlists
    })
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.post('/', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  try {
     user.playlists.push(req.body);
     await user.save();
     res.redirect(`/users/${user._id}/playlists`);
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${user._id}/playlists/new`);
  }
})

// Route to show a specific playlist
router.get('/:playlistId', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  try {
    // Look up the user from req.session and populate tracks
    const playlist = user.playlists.id(req.params.playlistId);
    const tracks = await Track.find({});
    console.log(tracks)
    // Render the show view, passing the playlist data
    res.render('playlists/show.ejs', {
      playlist: playlist,
      tracks: tracks,
      user: req.session.user,  // Ensure you pass the user to the view
    });
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${user._id}/playlists`);
  }
}); // This code defines a route to handle GET requests to /playlists/:playlistId. 
// It retrieves the playlist by its ID and renders the show.ejs page with the playlist data.

router.delete('/:playlistId', async (req, res) => {
  const user = await User.findById(req.session.user._id); // Find the user by session ID
  try {
    const playlist = user.playlists.id(req.params.playlistId); // Find the playlist by ID and remove it
    if (playlist) {
    // removes the playlist
      user.playlists.remove(req.params.playlistId);
    // saves the changes made
      await user.save();
      res.redirect(`/users/${user._id}/playlists`);
    } else {
      res.status(404).send('Playlist not found');
    }
  } catch (error){
    console.log(error);
    res.redirect(`/users/${user._id}/playlists`);
  }
});

router.get('/:playlistId/edit', async (req, res) => {
  const user = await User.findById(req.session.user._id); // Find the user by session ID
  try {
    if (!user) {
      return res.status(404).send('User not found');
    } // check to see if the user exists. If it's not found, return a 404 error.

    const playlist = user.playlists.id(req.params.playlistId); // Find the playlist by ID and remove it
    if (!playlist) {
      return res.status(404).send('Playlist not found');
    } // check to see if the playlist exists. If it's not found, return a 404 error.
    
    res.render('playlists/edit.ejs', {
      playlist: playlist,
      user: user // Use the full user object from the database
    });
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${req.session.user._id}/playlists`);
  }
});

router.put('/:playlistId', async (req, res) => {
  const user = await User.findById(req.session.user._id); // Find the user by session ID
  try {
    const playlist = user.playlists.id(req.params.playlistId); // Find the playlist by ID and remove it
  playlist.set(req.body);
  await user.save();
  res.redirect(`/users/${user._id}/playlists/${playlist._id}`);
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${req.session.user._id}/playlists`);
  }
})

module.exports = router;
// exports your routers for use in server.js