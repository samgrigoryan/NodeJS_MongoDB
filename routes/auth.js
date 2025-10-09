const {Router} = require('express')
const User = require("../models/user")
const router = Router()

router.get("/login", async (req, res) =>{
    res.render("auth/login", {
        title: "Login page",
        isLogin: true
    })
})

router.get("/logout", async (req, res) =>{
    req.session.destroy(() => {
        res.redirect("/")
    })
})

router.post("/login", async (req, res) => {
    const user = await User.findById("68d9122d992642a6b66d0570");
    req.session.user = user
    req.session.isAuthenticated = true
    req.session.save(err => {
        if (err) {
            throw err
        }

        res.redirect("/")
    })
    
})

module.exports = router