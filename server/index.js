const express = require("express")
const path = require('path');
const dotenv = require("dotenv").config()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connToDB = require('./db.js')
const errorMiddleware = require("./errorMiddleware.js")
const helmet = require("helmet")

const port = process.env.PORT || 5000

connToDB()

const app = express()

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'", "https://www.youtube.com/", "https://drive.google.com", "https://doc-0c-5g-docs.googleusercontent.com"],
        scriptSrc: ["'self'", "example.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors({ origin: true, credentials: true }))
app.use(errorMiddleware)

app.use("/users", require("./routes.js"))
app.use("/notepad", require("./notepadRoutes.js"))
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => "server started")


