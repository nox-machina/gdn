const jsonwebtoken = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/User");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../functions/generateToken");

module.exports = async (req, res, next) => {
  const actkn = req.header("actkn");
  const rftkn = req.header("rftkn");
  if (!actkn || actkn == null) {
    return res.status(401).send({
      error: "Unauthorized request. Access denied",
    });
  }

  if (!rftkn || rftkn == null) {
    return res.status(401).send({
      error: "Invalid request. Access denied",
    });
  }

  try {
    const decoded = jsonwebtoken.verify(actkn, process.env.JWT_SECRET);
    req.user = decoded.user;
    console.log("next called");
    res.set("actkn", actkn);
    res.set("rftkn", rftkn);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      try {
        const decodedRefresh = jsonwebtoken.verify(
          rftkn,
          process.env.JWT_SECRET
        );
        req.user = decodedRefresh.user;

        const newAccessToken = generateAccessToken(req.user.id);
        const newRefreshToken = generateRefreshToken(req.user.id);

        const updatedUser = await User.findById(mongoose.Types.ObjectId(req.user.id));

        updatedUser.rftkn.token = newRefreshToken;
        updatedUser.rftkn.iat = Math.floor(Date.now() / 1000);
        console.log("updatedUser:", updatedUser);
        await updatedUser.save();

        if (req.path === "/logout") {
          next();
        }

        res.set("actkn", newAccessToken);
        res.set("rftkn", newRefreshToken);
        res.set("response", "Token has expired. New tokens generated");
        next();
      } catch (error) {
        return res.status(401).send({
          errormsg: "Looks like you've been inactive for too long. Please login again.",
          error: error.message,
          stack: error.stack,
        });
      }
    } else {
      return res.status(401).send({
        error: "Something wrong with the token",
        stack: error.stack
      });
    }
  }
};
