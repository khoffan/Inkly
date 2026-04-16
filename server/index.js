// build express example code
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();
const connectDB = require("./config/db_connect");
// router
const AuthPath = require("./Controller/auth");
const ProfilePath = require("./Controller/users");
const BlogPath = require("./Controller/blogs");
const CommentsPath = require("./Controller/comments");
const TagsController = require("./Controller/tags");

// connect to mongodb
connectDB();

//use middlewares
app.use(bodyParser.json());
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/api", AuthPath);
app.use("/api", ProfilePath);
app.use("/api", BlogPath);
app.use("/api", CommentsPath);
app.use("/api", TagsController);

// support json encoded bodies

app.get("/", (req, res) => {
	res.send({
		message: "Inkly API is running"
	});
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: err.message || "Something went wrong!"
    });
});

//listen server
const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`Inkly server listening on port ${port}`);
});
