const express = require('express');
const router = express.Router();
// require all essential modules at the top of each controller
const Track = require('../models/track.js');

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

  
module.exports = router;
// exports your routers for use in server.js

// tracks refernce the fruti lesson