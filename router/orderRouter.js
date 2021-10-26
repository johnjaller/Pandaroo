const express = require("express");
class OrderRouter {
  constructor(orderService) {
    this.orderService = orderService;
  }
  route() {
    let router = express.Router();
    router.get("/:restId", this.getRestOrderDefault.bind(this));
    router.get("/:restId/:category", this.getRestOrderCategory.bind(this));
    router.put("/:orderId", this.putCancelUserOrder.bind(this));
    return router;
  }
  async getRestOrderDefault(req, res) {
    try {
      let deliverySwitch = await this.orderService.getDeliveryStatus(
        req.params.restId
      );
      if (deliverySwitch[0].delivery === true) {
        let rating = await this.orderService.getRestRating(req.params.restId);
        if (rating.length != 0) {
          rating =
            Math.round(
              (rating
                .map((item) => Number(item.rating))
                .reduce((a, b) => a + b) /
                rating.length) *
                2
            ) / 2;
          console.log(rating);
        } else {
          rating = 0;
        }
        let restDetail = await this.orderService.getRestDetail(
          req.params.restId
        );
        restDetail[0]["rating"] = rating.toString();
        let bookmark = await this.orderService.getUserBookmarkStatus(
          req.user.id,
          req.params.restId
        );
        let bookmarkClass;
        let dish = await this.orderService.getRestDishes(
          req.params.restId,
          "soup&salad"
        );
        if (bookmark.length != 0) {
          bookmarkClass = "fas";
        } else {
          bookmarkClass = "far";
        }
        let dishItems = [];
        dish.forEach((i) => {
          dishItems.push({
            id: i.id,
            name: i.item,
            price: i.price,
            photoPath: i.photo_path,
          });
        });
        return res.render("userOrder", {
          layout: "user",
          restaurant: restDetail[0],
          dish: dishItems,
          bookmark: bookmarkClass,
        });
      } else {
        res.redirect(`/booking/${req.params.restId}`);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getRestOrderCategory(req, res) {
    try {
      let deliverySwitch = await this.orderService.getDeliveryStatus(
        req.params.restId
      );
      if (deliverySwitch[0].delivery === true) {
        let rating = await this.orderService.getRestRating(req.params.restId);
        if (rating.length != 0) {
          rating =
            Math.round(
              (rating
                .map((item) => Number(item.rating))
                .reduce((a, b) => a + b) /
                rating.length) *
                2
            ) / 2;
          console.log(rating);
        } else {
          rating = 0;
        }
        let restDetail = await this.orderService.getRestDetail(
          req.params.restId
        );
        restDetail[0]["rating"] = rating.toString();
        let bookmark = await this.orderService.getUserBookmarkStatus(
          req.user.id,
          req.params.restId
        );
        let bookmarkClass;
        let dish = await this.orderService.getRestDishes(
          req.params.restId,
          req.params.category
        );
        if (bookmark.length != 0) {
          bookmarkClass = "fas";
        } else {
          bookmarkClass = "far";
        }
        let dishItems = [];
        dish.forEach((i) => {
          dishItems.push({
            id: i.id,
            name: i.item,
            price: i.price,
            photoPath: i.photo_path,
          });
        });
        return res.render("userOrder", {
          layout: "user",
          restaurant: restDetail[0],
          dish: dishItems,
          bookmark: bookmarkClass,
        });
      } else {
        res.redirect(`/booking/${req.params.restId}`);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  putCancelUserOrder(req, res) {
    return this.orderService
      .putCancelOrder(Number(req.params.orderId))
      .then(() => {
        res.send("success");
      });
  }
}

module.exports = OrderRouter;
