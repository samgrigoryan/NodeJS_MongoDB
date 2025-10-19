const { Router } = require("express");
const bcrypt = require('bcryptjs')
const User = require("../models/user");
const router = Router();

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Login page",
    isLogin: true,
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = await User.findOne({ email });

    if (candidate) {
       
      const areSome = await bcrypt.compare(password, candidate.password);
      if (areSome) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          }

          res.redirect("/");
        });
      } else {
        res.redirect("/auth/login#register");
      }
    } else {
      res.redirect("/auth/login#register");
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { reg_email, name, reg_password, confirm } = req.body;

    const candidate = await User.findOne({ email: reg_email });

    if (reg_password !== confirm) {
      return res.status(400).send("sxala bratt");
    }

    if (candidate) {
      res.redirect("/auth/login");
    } else {
      const hashPassword = await bcrypt.hash(reg_password, 10)
      const user = new User({
        email: reg_email,
        name,
        password: hashPassword,
        card: { items: [] },
      });
      await user.save();
      res.redirect("/auth/login#login");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
