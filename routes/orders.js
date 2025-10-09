const { Router } = require("express");
const Order = require("../models/order");


const router = Router();

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({
      "userId": req.user._id,
    })
      .populate("userId")
      .lean();

    res.render("orders", {
      isOrders: true,
      title: "Order Page",
      orders: orders.map((o) => {
        return {
          ...o,
          courses: o.courses.map((c) => ({
            title: c.course.title,
            count: c.count,
            price: c.course.price,
          })),
          price: o.courses.reduce((total, c) => {
            return (total += c.count * c.course.price);
          }, 0),
        };
      }),
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await req.user.populate("card.items.courseId");

    const courses = user.card.items.map((i) => ({
      count: i.count,
      course: { ...i.courseId._doc },
    }));

    const order = new Order({
      courses: courses,
      userId: req.user,
    });

    await order.save();
    await req.user.clearCart();

    res.redirect("/orders");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
