const allowedOrigens = require("./allowedOrigens");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigens.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("not powerd by cors !"));
    }
  },
  credentials: true,
  optionsSeccessStatus: 200,
};

module.exports = corsOptions;
