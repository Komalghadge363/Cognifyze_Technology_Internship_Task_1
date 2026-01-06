const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/userForms")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    gender: String
});

const User = mongoose.model("User", userSchema);

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

// Register form handling
app.post("/register", async (req, res) => {
    const { name, email, age, gender } = req.body;

    const newUser = new User({ name, email, age, gender });
    await newUser.save();

    res.render("success", { user: newUser });
});

// Login form handling
app.post("/login", async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        res.render("success", { user });
    } else {
        res.send("User not found!");
    }
});

// CRUD Routes

// READ – display users
app.get("/users", async (req, res) => {
    const users = await User.find();
    res.render("users", { users });
});

// UPDATE – edit form
app.get("/users/edit/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render("edit", { user });
});

// UPDATE – save update
app.post("/users/update/:id", async (req, res) => {
    const { name, email, age, gender } = req.body;

    await User.findByIdAndUpdate(req.params.id, {
        name, email, age, gender
    });

    res.redirect("/users");
});

// DELETE
app.get("/users/delete/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/users");
});


// Start Server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
