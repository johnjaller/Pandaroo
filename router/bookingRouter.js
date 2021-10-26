const express = require("express");
class BookingRouter {
  constructor(bookingService) {
    this.bookingService = bookingService;
  }

  route() {
    let router = express.Router();
    router.get("/:restId", this.getBookingDefault.bind(this));
    router.get("/:restId/:category", this.getBookingCategory.bind(this));
    router.post("/:restId", this.postBooking.bind(this));
    router.put("/:bookingId", this.putCancelBooking.bind(this));
    return router;
  }

  async getBookingDefault(req, res) {
    let restDetail = await this.bookingService.getRestDetail(req.params.restId);
    let bookmark = await this.bookingService.getUserBookmarkStatus(
      req.user.id,
      req.params.restId
    );
    let bookmarkClass;
    let rating = await this.bookingService.getRestRating(req.params.restId);
    if (rating.length != 0) {
      rating =
        Math.round(
          (rating.map((item) => Number(item.rating)).reduce((a, b) => a + b) /
            rating.length) *
            2
        ) / 2;
      console.log(rating);
    } else {
      rating = 0;
    }
    restDetail[0]["rating"] = rating;
    let dish = await this.bookingService.getRestDishes(
      req.params.restId,
      "soup&salad"
    );
    console.log(dish);
    console.log(bookmark);
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
    console.log(restDetail);
    return res.render("userBooking", {
      layout: "user",
      restaurant: restDetail[0],
      dish: dishItems,
      bookmark: bookmarkClass,
    });
  }

  async getBookingCategory(req, res) {
    let restDetail = await this.bookingService.getRestDetail(req.params.restId);
    let bookmark = await this.bookingService.getUserBookmarkStatus(
      req.user.id,
      req.params.restId
    );
    let bookmarkClass;
    let rating = await this.bookingService.getRestRating(req.params.restId);
    if (rating.length != 0) {
      rating =
        Math.round(
          (rating.map((item) => Number(item.rating)).reduce((a, b) => a + b) /
            rating.length) *
            2
        ) / 2;
      console.log(rating);
    } else {
      rating = 0;
    }
    restDetail[0]["rating"] = rating;
    let dish = await this.bookingService.getRestDishes(
      req.params.restId,
      req.params.category
    );
    console.log(dish);
    console.log(bookmark);
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
    console.log(restDetail);
    return res.render("userBooking", {
      layout: "user",
      restaurant: restDetail[0],
      dish: dishItems,
      bookmark: bookmarkClass,
    });
  }

  postBooking(req, res) {
    console.log(req.body);
    let bookingCart;
    if (req.body.bookingCart != "") {
      bookingCart = JSON.parse(req.body.bookingCart);
    } else {
      bookingCart = [];
    }
    return this.bookingService
      .insertBooking(
        req.params.restId,
        req.user.id,
        req.body.bookingTime,
        req.body.bookingDate,
        req.body.specialRequest,
        req.body.noOfGuest,
        "confirmed"
      )
      .then(async (bookingId) => {
        if (bookingCart.length != 0) {
          for (let i = 0; i < bookingCart.item.length; i++) {
            await this.bookingService.insertBookingDetail(
              bookingId[0],
              bookingCart.item[i].menuId,
              bookingCart.item[i].amount
            );
          }
        }
        res.redirect("/user");
      });
  }

  putCancelBooking(req, res) {
    return this.bookingService.putBooking(req.params.bookingId).then(() => {
      res.send("success");
    });
  }
}

module.exports = BookingRouter;
