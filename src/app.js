const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    console.log(process.env.DBURL)
    mongoose.connect(
      `${process.env.DBURL}`,
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err.message);
  }
};

connectToDatabase();

//Routes
const auth = require("./routes/auth");
const games = require("./routes/games");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", auth);
app.use("/", games);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
