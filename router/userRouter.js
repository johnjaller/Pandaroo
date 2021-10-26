const express = require("express");
class UserRouter {
  constructor(userService) {
    this.userService = userService;
  }

  route() {
    let router = express.Router();
    router.get("/", this.getBooking.bind(this));
    router.get("/order", this.getOrder.bind(this));
    router.get("/bookmark", this.getBookmark.bind(this));
    router.put("/info", this.putUserInfo.bind(this));

    router.get("/setup", this.getUserSetUp.bind(this));
    router.put("/setup", this.putUserSetUp.bind(this));

    return router;
  }

  async getBooking(req, res) {
    try {
      console.log(req.cookies);
      console.log(req.user.id);
      console.log(req.session);
      let userInfo = await this.userService.getUserInfo(req.user.id);
      let userBooking = await this.userService.getUserBooking(req.user.id);
      console.log(userBooking);
      if (userBooking.length === 1) {
        let date = userBooking[0].booking_date.toDateString();
        userBooking[0].booking_date = date;
      }
      return res.render("userInfo", {
        layout: "user",
        info: userInfo,
        booking: userBooking,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getOrder(req, res) {
    try {
      let userInfo = await this.userService.getUserInfo(req.user.id || 1);
      let userOrder = await this.userService.getUserOrder(req.user.id || 1);
      console.log(userOrder);
      return res.render("userInfo", {
        layout: "user",
        info: userInfo,
        order: userOrder,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getBookmark(req, res) {
    try {
      let userInfo = await this.userService.getUserInfo(req.user.id);
      let userBookmark = await this.userService.getUserBookmark(req.user.id);
      console.log(userBookmark);
      return res.render("userInfo", {
        layout: "user",
        info: userInfo,
        bookmark: userBookmark,
      });
    } catch (error) {
      console.log(error);
    }
  }

  putUserInfo(req, res) {
    console.log(req.body);
    return this.userService
      .putUserInfo(
        req.user.id,
        req.body.username,
        req.body.firstname,
        req.body.surname,
        req.body.address,
        req.body.district,
        req.body.phone
      )
      .catch((e) => console.log(e));
  }

  getUserSetUp(req, res) {
    res.render("userSetUp", { layout: "user" });
  }

  async putUserSetUp(req, res) {
    await this.userService.putUserSetUp(req.user.id, req.body);
    return res.sendStatus(200);
  }
}

module.exports = UserRouter;
