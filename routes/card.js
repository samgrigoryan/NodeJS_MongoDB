const { Router } = require("express");
const Course = require("../models/course");
const router = Router();

function mapCartItems(cart) {
  return cart.items.map((c) => ({
    ...c.courseId.toObject(),
    count: c.count,
  }));
}

function computePrice(courses) {
  return courses.reduce((total, course) => {
    return (total += course.price * course.count);
  }, 0);
}

router.post("/add", async (req, res) => {
  course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  res.redirect("/card");
});

router.delete("/remove/:id", async (req, res) => {
  await req.user.removeFromCard(req.params.id);

  const user = await req.user.populate("card.items.courseId");

  const courses = mapCartItems(user.card);
  const cart = {
    courses,
    price: computePrice(courses),
  };

  res.status(200).json(cart);
});

router.get("/", async (req, res) => {
  const user = await req.user.populate("card.items.courseId");

  const courses = mapCartItems(user.card);

  res.render("card", {
    title: "Basket",
    isCard: true,
    courses: courses,
    price: computePrice(courses),
  });
});

module.exports = router;
