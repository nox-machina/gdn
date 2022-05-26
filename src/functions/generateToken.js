const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  const payload = {
    user: { id: user },
  };

  const options = {
    expiresIn: "1 minute",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const generateRefreshToken = (user) => {
  const payload = {
    user: { id: user },
  };
  const options = {
    expiresIn: "2 minutes",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
