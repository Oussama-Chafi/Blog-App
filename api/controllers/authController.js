const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  registerSchema,
  loginSchema,
} = require("../validations/authValidation");
const AppError = require("../utils/AppEroor");
const sendEmail = require("../utils/sendEmail");
const errorHandler = require("../middlewares/errorHandler");

const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) throw new AppError(error.details[0].message, 400);
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password) {
    throw new AppError("All failds are require !", 400);
  }
  const isUserExist = await User.findOne({ email }).exec();
  if (isUserExist) throw new AppError("this account is Exist", 409);

  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const newUser = await User.create({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
  });
  const verificationUrl = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;

  await sendEmail(
    email,
    "Email verification",
    ` <h1>confirm your Email</h1>
      <a href = "${verificationUrl}" >click here</a>
    `,
  );

  const accessToken = jwt.sign(
    {
      userInfo: {
        id: newUser._id,
        role: newUser.role,
      },
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign(
    {
      userInfo: {
        id: newUser._id,
        role: newUser.role,
      },
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "7d" },
  );
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  const user = newUser;
  res.json({
    message: "welcome",
    user: {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      isVerified: user.isVerified,
      verificationTokenExpiry: user.verificationTokenExpiry,
      avatar: user.avatar,
    },
    
  });
};

const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) throw new AppError(error.details[0].message, 400);
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("All failds are require", 400);
  }
  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) {
    throw new AppError("the eamil or password is not correct !", 400);
  }
  const checkPassword = await bcrypt.compare(password, foundUser.password);

  if (foundUser.lockUntil && foundUser.lockUntil > Date.now()) {
    throw new AppError("this account is locked , please try again", 423);
  }
  if (!checkPassword) {
    await User.findByIdAndUpdate(foundUser._id, {
      $inc: {
        loginAttampts: 1,
      },
    });
    if (foundUser.loginAttampts + 1 >= 5) {
      await User.findByIdAndUpdate(foundUser._id, {
        lockUntil: Date.now() + 30 * 60 * 1000,
      });
      throw new AppError(
        "this account is closed right now , please try again later",
        400,
      );
    }
    throw new AppError("the email or password is not correct", 400);
  }

  await User.findByIdAndUpdate(foundUser._id, {
    loginAttampts: 0,
    lockUntil: null,
  });

  const accessToken = jwt.sign(
    {
      userInfo: {
        id: foundUser._id,
        role: foundUser.role,
      },
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign(
    {
      userInfo: {
        id: foundUser._id,
        role: foundUser.role,
      },
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "7d" },
  );
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  const user = await foundUser;
  res.json({
    message: "welcome back",
    user: {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      isVerified: user.isVerified,
      verificationTokenExpiry: user.verificationTokenExpiry,
      avatar: user.avatar,
    },
    accessToken,
  });
};

const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    throw new AppError("Unauthorized", 401);
  }
  const token = cookies.jwt;
  jwt.verify(token, process.env.REFRESH_TOKEN, async (err, decoded) => {
    if (err) {
      throw new AppError("forbidden", 403);
    }
    const foundUser = await User.findById(decoded.userInfo.id).exec();
    if (!foundUser)
      throw new AppError("this account is not exist enymore", 401);

    const accessToken = jwt.sign(
      {
        userInfo: {
          id: foundUser._id,
          role: foundUser.role,
        },
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" },
    );
    const user = await foundUser;
    res.json({
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        isVerified: user.isVerified,
        verificationTokenExpiry: user.verificationTokenExpiry,
        avatar: user.avatar,
      },
      accessToken,
    });
  });
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    throw new AppError("Unauthorized", 401);
  }
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.json({ message: "see you soon !" });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
