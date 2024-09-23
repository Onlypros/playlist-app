const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Track = require('../models/track.js');

router.get('/new', async (req, res) => {
    res.render('playlists/new.ejs');
  });

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

router.get('/:playlistId', async (req, res) => {
  const user = await User.findById(req.session.user._id).populate({
    path:'playlists', 
    populate:{
      path:'tracks',
    }
  });
  try {
    const playlist = user.playlists.id(req.params.playlistId);
    const tracks = await Track.find({});
    console.log(tracks)
    res.render('playlists/show.ejs', {
      playlist: playlist,
      tracks: tracks,
      user: req.session.user,  
    });
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${user._id}/playlists`);
  }
}); 

router.delete('/:playlistId', async (req, res) => {
  const user = await User.findById(req.session.user._id); 
  try {
    const playlist = user.playlists.id(req.params.playlistId); 
    if (playlist) {
      user.playlists.remove(req.params.playlistId);
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
  const user = await User.findById(req.session.user._id); 
  try {
    if (!user) {
      return res.status(404).send('User not found');
    } 

    const playlist = user.playlists.id(req.params.playlistId); 
    if (!playlist) {
      return res.status(404).send('Playlist not found');
    } 
    
    res.render('playlists/edit.ejs', {
      playlist: playlist,
      user: user 
    });
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${req.session.user._id}/playlists`);
  }
});

router.put('/:playlistId', async (req, res) => {
  const user = await User.findById(req.session.user._id); 
  try {
    const playlist = user.playlists.id(req.params.playlistId); 
  playlist.set(req.body);
  await user.save();
  res.redirect(`/users/${user._id}/playlists/${playlist._id}`);
  } catch (error) {
    console.log(error);
    res.redirect(`/users/${req.session.user._id}/playlists`);
  }
})

module.exports = router;
