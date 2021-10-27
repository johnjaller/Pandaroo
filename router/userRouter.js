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

  async getBooking(req, res, next) {
    try {
      console.log(req.cookies);
      console.log(req.user.id);
      console.log(req.session);
      let userInfo = await this.userService.getUserInfo(req.user.id);
      let userBooking = await this.userService.getUserBooking(req.user.id);
      console.log(userBooking);
      return res.render("userInfo", {
        layout: "user",
        info: userInfo,
        booking: userBooking,
      });
    } catch (error) {
      next(error);
      throw new Error(error);
    }
  }

  async getOrder(req, res, next) {
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
      next(error);
      throw new Error(error);
    }
  }

  async getBookmark(req, res, next) {
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
      next(error);
      throw new Error(error);
    }
  }

  async putUserInfo(req, res, next) {
    try {
      await this.userService.putUserInfo(
        req.user.id,
        req.body.username,
        req.body.firstname,
        req.body.surname,
        req.body.address,
        req.body.district,
        req.body.phone
      );
      return res.sendStatus(200);
    } catch (error) {
      next(error);
      throw new Error(error);
    }
  }

  getUserSetUp(req, res) {
    res.render("userSetUp", { layout: "user" });
  }

  async putUserSetUp(req, res, next) {
    try {
      await this.userService.putUserSetUp(req.user.id, req.body);
      return res.sendStatus(200);
    } catch (error) {
      next(error);
      throw new Error(error);
    }
  }
}

module.exports = UserRouter;
