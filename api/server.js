require("dotenv").config();
require("express-async-error");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const connect = require("./db/connect");
const mongoose = require("mongoose");
connect();
const cors = require("cors"); //
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const path = require("path");

const errorHandler = require("./middlewares/errorHandler");
const rateLimit = require("./middlewares/rateLimiter");
const User = require("./models/userSchema");

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(rateLimit);

app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/adminRoute"));
app.use("/profile", require("./routes/profileRoute"));
app.use("/", require("./routes/photoRoute"));
app.use("/posts", require("./routes/postsRoute"));

require("./middlewares/cron");

app.use((req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.status(404).json({ message: "this page not found !" });
  } else {
    res.type("txt").send("this page not found !");
  }
});

mongoose.connection.once("open", () => {
  console.log("connect to dbs is success");
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

app.use(errorHandler);
