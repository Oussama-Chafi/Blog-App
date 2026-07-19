const cron = require("node-cron");
const User = require("../models/userSchema");

cron.schedule("0 1 * * *", async () => {
  try {
    const now = new Date();

    const deleteAccounts = await User.deleteMany({      
      isVerified: false,
      verificationTokenExpiry: { $ne: null, $lt: now },
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = cron;
