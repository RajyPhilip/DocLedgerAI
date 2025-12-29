const bcrypt = require("bcrypt");
const { signToken } = require("../utils/jwt");

const hashPassword = (password) => bcrypt.hash(password, 10);

const comparePassword = (password, hash) =>
  bcrypt.compare(password, hash);

const generateToken = (user) =>
  signToken({
    userId: user.id,
    email: user.email,
  });

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
};
