const Joi = require("joi");

const isEmail = (value) => {
  const payload = {
    email: value,
  };

  const { error } = Joi.object({
    email: Joi.string().email().required(),
  }).validate(payload);

  if (!error) {
    return true;
  } else {
    return false;
  }
};

const validateSignup = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(406).send({
      error: "Invalid request body",
    });
  }
  //if no email
  if (!req.body.email) {
    return res.status(406).send({
      error: "Email is required",
    });
  }
  //if no username
  if (!req.body.username) {
    return res.status(406).send({
      error: "Username is required",
    });
  }
  //if no password
  if (!req.body.password) {
    return res.status(406).send({
      error: "Password is required",
    });
  }

  if (!req.body.birthdate) {
    return res.status(406).send({
      error: "Birthdate is required",
    });
  }

    //if password is less than 6 characters
    if (req.body.password.length < 6) {
        return res.status(406).send({
            error: "Password must be at least 6 characters",
        });
    }

  //if valid email
  if (isEmail(req.body.email)) {
    return next();
  } else {
    return res.status(406).send({
      error: "Invalid email",
    });
  }
};

module.exports = {
  validateSignup,
  isEmail,
};
