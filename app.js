const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");

const AppError = require("./utils/appError");
const { middlewareError } = require("./controllers/errorController");
const roomRouter = require("./routes/roomRouter");
const viewRouter = require("./routes/viewRouter");

const app = express();
/////
app.enable("trust proxy");
//Render some template and see this in your wep
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
//1)Global Middleware
///this helmet for more than 15 middle ware functions
app.use(helmet());
//this will make app work with post and get
app.use(cors());
//this will open all methods
app.options(`*`, cors());
//to know some info about your requestes in development
if (process.env.NODE_ENV === "development") app.use(morgan(`dev`));

//limit request from same IP
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, Please try again in an hour!",
});
app.use("/api", limiter);

//Bodyparser, reading data from body into req.body
app.use(express.json({ limit: "10000kb" }));
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());
//Data sanitization against XSS
app.use(xss());
//Prevent parameters pullution

app.use(compression());
//serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, `public`)));

///try playing with middleware

//other try test middle ware function
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

const viewURL = "/";
app.use(viewURL, viewRouter);
const roomURL = "/api/v1/rooms";
app.use(roomURL, roomRouter);

//for error
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(middlewareError);
module.exports = app;
