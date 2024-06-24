// Create a server
const express = require("express");
const app = express();
const port = 3400;
const connectDB = require("./db/database");
const Register = require("./db/schema");
const cookiesparser = require("cookie-parser");

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({
    extended: false
}));



app.get('/', (req, res) => {
    res.status(201).render("index");
})

app.get("/register", (req, res) => {
    res.status(201).render("register")
})

app.post("/register", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        // console.log(email);
        const userExist = await Register.findOne({ email: email });

        if (!userExist) {
            const Data = new Register({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })
            // Generate token
            const token = await Data.generateToken();
            // console.log(token);
            const datasave = await Data.save();
            console.log(datasave);
            // cookies store on server 
            res.cookie("Register Cookies",token,{
                expires: new Date(Date.now() + 60000),
                httpOnly:true
            });
            res.status(201).redirect("/");
        }
        else {
            res.json({ msg: "User Already Exists" });
        }
    } catch (error) {
        console.log(error);
    }
})


app.get("/login", (req, res) => {
    res.status(201).render("login");
})

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await Register.findOne({ email, password });
        // Create a login token
        if (!user) {
            res.status(401).json({ msg: "Invalid Details" });
        }
        else {
            const token = await user.generateToken();
            console.log(token);
            
            // set cookies of server

            res.cookie("login",token,{
                expires: new Date(Date.now() + 60000),
                httpOnly:true
            });
            res.status(201).redirect("/");
        }
    } catch (error) {
        console.log(error);
    }
})


// Admin
app.get("/admin", async (req, res) => {
    const data = await Register.find({});
    res.status(201).render("admin", {
        users: data
    });
})

// get Edit file
app.get("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const editData = await Register.findById({ _id: id });

    if (editData == null) {
        res.redirect("/");
    } else {
        res.render("edit", {
            user: editData
        })
    }
})

// Update Data
app.post("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const updateData = await Register.findByIdAndUpdate({ _id: id }, { username, email, password }, { new: true })
    res.redirect("/admin");
})


// Delete Date
app.get("/delete/:id",async (req, res) => {
    const {id} = req.params;
    const deleteData = await Register.findByIdAndDelete({_id:id});
    res.redirect("/admin");
})
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`http://localhost:${port}`);
    })
})