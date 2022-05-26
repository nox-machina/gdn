const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
});

const Game = mongoose.model("Game", GameSchema);
module.exports = Game;