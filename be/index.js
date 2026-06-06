const express = require("express");
const app = express();

const cors = require("cors");
const session = require("express-session");
const path = require("path");

const dbConnect = require("./db/dbConnect");

const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const AdminRouter = require("./routes/AdminRouter");
const RegisterRouter = require("./routes/RegisterRouter");
const CommentRouter = require("./routes/CommentRouter");
const UploadRouter = require("./routes/UploadRouter");
dbConnect();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: "photoapp",
    resave: false,
    saveUninitialized: false,

    cookie: {
      secure: false,
      sameSite: "lax",
      httpOnly: true,
    },
  })
);


app.use("/admin", AdminRouter);

app.use("/api", RegisterRouter);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  if (req.path === "/login" || req.path === "/logout") {
    return next();
  }
  if (!req.session.user) {
    return res.status(401).send("Unauthorized");
  }
  next();
});

app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);
app.use("/api/photo", CommentRouter);
app.use("/photos", UploadRouter);

app.get("/", (req, res) => {
  res.send({
    message: "Photo Sharing API Running",
  });
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
