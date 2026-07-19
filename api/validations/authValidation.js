const joi = require("joi");

const registerSchema = joi.object({
  first_name: joi.string().min(2).max(15).required(),
  last_name: joi.string().min(2).max(15).required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

const updatePasswordSchema = joi.object({
  oldPassword: joi.string().min(8).required(),
  newPassword: joi.string().min(8).required(),
});

module.exports = { registerSchema, loginSchema, updatePasswordSchema };
