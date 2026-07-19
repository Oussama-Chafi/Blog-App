const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;
