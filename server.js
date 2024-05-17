require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const connectDB = require("./db");
const DataUser = require("./dataSchema");
const cookiesParser = require("cookie-parser");

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");

// Create all route
app.get("/", (req, res) => {
  res.status(201).render("index");
});

app.get("/register", (req, res) => {
  res.status(201).render("register");
});

app.post("/register", async (req, res) => {
  try {
    const email = req.body.email;
    const userExist = await DataUser.findOne({ email: email });
    console.log(userExist);
    if (!userExist) {
      const fillDate = new DataUser({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });

      // Generate Token
      const token = await fillDate.generateToken();
      console.log("Server Token", token);

      // store token on server
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 60000),
        httpOnly: true,
      });

      const storeData = await fillDate.save();
      console.log("Store Data successfull..");
      res.status(201).render("index");
    } else {
      res.json({ msg: "User Already Exist.." });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/login", (req, res) => {
  res.status(201).render("login");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const DB_email = await DataUser.findOne({ email: email });
    const password = req.body.password;

    if (DB_email.password === password) {
      // generate token
      const token = await DB_email.generateToken();
      console.log("Login Token: ", token);

      //store login token
      res.cookie("loginjwt", token, {
        expires: new Date(Date.now() + 60000),
        httpOnly: true,
      });

      res.status(201).render("index");
    } else {
      res.json({ msg: "Invalid Details" });
    }
  } catch (error) {
    console.log("login error", error);
  }
});

app.get("/admin", async (req, res) => {
  const adminData = await DataUser.find({});
  res.status(201).render("admin", {
    users: adminData,
  });
});

app.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const editData = await DataUser.findById({ _id: id });

  if (editData == null) {
    res.redirect("/");
  } else {
    res.render("edit", {
      user: editData,
    });
  }
});

app.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  const updateData = await DataUser.findByIdAndUpdate(
    { _id: id },
    { username, email, password },
    {
      new: true,
    }
  );
  res.redirect("/");
});

app.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const deleteData = await DataUser.findByIdAndDelete({ _id: id });
  res.redirect("/admin");
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
});
