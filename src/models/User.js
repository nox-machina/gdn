const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 2,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    birthdate: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      default: null
    },
    rftkn: {
      token: {
        type: String,
      },
      iat: {
        type: Number,
      },
    },
    handles: [
      {
        discord: {
          type: String,
          default: null,
        },
        steam: {
          type: String,
          default: null,
        },
        psn: {
          type: String,
          default: null,
        },
        xbl: {
          type: String,
          default: null,
        },
        battlenet: {
          type: String,
          default: null,
        },
        riot: {
          type: String,
          default: null,
        },
      },
    ],
    games: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
      },
    ],
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge",
      },
    ],
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
