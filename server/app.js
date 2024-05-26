require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const logger = require("morgan");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");
const db = require("./config/db");
const passport = require("passport");
const app = express();

const sessionStore = MongoStore.create({
  mongoUrl: db.client.s.url,
  collection: "sessions",
});

//Initialize session
app.use(
  session({
    secret: "keyboard",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1 * 15 * 60 * 1000,
    },
    store: sessionStore
  })
);
//Initialize Passport
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true
}));

app.use(logger("dev"));
app.use(helmet());

app.use((req, res, next) => {
  console.log(req.isAuthenticated());
  console.log(req.session);
  next();
});

const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

app.get("/", (req, res, next) => {
  return res.send("Server running!");
});

// error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on PORT: ${port}`);
});
