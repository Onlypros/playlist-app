const express = require('express');
const router = express.Router();
// require all essential modules at the top of each controller
const User = require('../models/user.js');

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
  try {
    const user = await User.findById(req.session.user._id);
     user.playlists.push(req.body);
     await user.save();
     res.redirect('/playlists');
  } catch (error) {
    console.log(error);
    res.redirect('/playlists/new');
  }
})

module.exports = router;
// exports your routers for use in server.js

