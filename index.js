const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const session = require("express-session")
const MongoStore = require("connect-mongodb-session")(session)
const homeRouts = require("./routes/home");
const coursesRouts = require("./routes/courses");
const addRouts = require("./routes/add");
const cardRouts = require("./routes/card");
const ordersRouts = require("./routes/orders");
const authRouts = require("./routes/auth")
const User = require("./models/user");
const varMiddleware = require("./middleware/variables")
const userMiddleware = require("./middleware/user")

const MONGODB_URI = `mongodb+srv://sam_test_DB:1eSn5MLnOdRDtTmr@cluster0.ncagesu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});


const store = new MongoStore({
  collection: 'sessions',
  uri: MONGODB_URI,
  
})

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

// app.use(async (req, res, next) => {
//   try {
//     const user = await User.findById("68d9122d992642a6b66d0570");
//     req.user = user;
//     next();
//   } catch (e) {
//     console.log(e);
//   }
// });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extends: true }));
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store
}))

app.use(varMiddleware)
app.use(userMiddleware)

app.use("/", homeRouts);
app.use("/courses", coursesRouts);
app.use("/add", addRouts);
app.use("/card", cardRouts);
app.use("/orders", ordersRouts);
app.use("/auth", authRouts)

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);

    // const candidate = await User.findOne();
    // if (!candidate) {
    //   const user = new User({
    //     email: "samvel@gmail.com",
    //     name: "Samvel",
    //     card: { items: [] },
    //   });
    //   await user.save();
    // }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
