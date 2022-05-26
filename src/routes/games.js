const express = require("express");
const router = express.Router();

const Game = require("../models/Game");

// const { addToDb } = require("../functions/misc");

//get games
router.get("/games", async (req, res) => {
    // addToDb();
  const games = await Game.find({});
  res.send(games);
});

module.exports = router;
