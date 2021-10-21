const express = require("express");

class RestRouter {
  constructor(restService) {
    this.restService = restService;
  }

  router() {
    let router = express.Router();

    router.get("/info", this.get.bind(this));
    router.get("/info/:category", this.getCategory.bind(this));
    router.get("/bookings", this.getBooking.bind(this));
    router.get("/orders", this.getOrder.bind(this));
    router.get("/bookingshistory", this.getBookingHistory.bind(this));
    router.get("/ordershistory", this.getOrderHistory.bind(this));
    router.put("/bookings/:bookingID", this.updateBookingStatus.bind(this));
    router.put("/orders/:orderID", this.updateOrderStatus.bind(this));

    return router;
  }

  async get(req, res) {
    console.log("Get restaurant info");
    try {
      let restInfo = await this.restService.getRestInfo(1);
      let dishInfo = await this.restService.getMenu(1, "soup&salad");
      if (restInfo[0]["delivery"]) {
        restInfo[0]["delivery"] = "Yes";
      } else {
        restInfo[0]["delivery"] = "No";
      }
      console.log("Rest info", restInfo);
      console.log("Dish info", dishInfo);
      return res.render("restInfo", {
        layout: "restaurant",
        restInfo: restInfo,
        dishInfo: dishInfo,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCategory(req, res) {
    console.log(req.params.category);
    console.log("Get restaurant menu");
    try {
      let restInfo = await this.restService.getRestInfo(1);
      let dishInfo = await this.restService.getMenu(1, req.params.category);
      if (restInfo[0]["delivery"]) {
        restInfo[0]["delivery"] = "Yes";
      } else {
        restInfo[0]["delivery"] = "No";
      }
      console.log("Rest info", restInfo);
      console.log("Dish info", dishInfo);
      return res.render("restInfo", {
        layout: "restaurant",
        restInfo: restInfo,
        dishInfo: dishInfo,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getBooking(req, res) {
    console.log("Get restaurant current booking");
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      let restBooking = await this.restService.getRestCurrentBooking(1);
      let totalRecords = restBooking.length;
      console.log("Total booking records", totalRecords);
      const totalPage = Math.ceil(totalRecords / limit);
      const hasLastPage = totalPage > 1 && page !== 1 ? true : false;
      const hasNextPage = totalPage > 1 && page !== totalPage ? true : false;

      const restBookingResult = restBooking.slice(startIndex, endIndex);
      console.log("Rest booking", restBookingResult);

      return res.render("restBooking", {
        layout: "restaurant",
        restBooking: restBookingResult,
        type: "bookings",
        currentPage: page,
        totalPage,
        hasLastPage,
        hasNextPage,
        nextPage: page + 1,
        lastPage: page - 1,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getOrder(req, res) {
    console.log("Get restaurant current order");
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      let restOrder = await this.restService.getRestCurrentOrder(1);
      console.log("Rest order", restOrder);
      let totalRecords = restOrder.length;
      console.log("Total order records", totalRecords);
      const totalPage = Math.ceil(totalRecords / limit);
      const hasLastPage = totalPage > 1 && page !== 1 ? true : false;
      const hasNextPage = totalPage > 1 && page !== totalPage ? true : false;

      const restOrderResult = restOrder.slice(startIndex, endIndex);
      console.log("Rest order result", restOrderResult);

      return res.render("restOrder", {
        layout: "restaurant",
        restOrder: restOrderResult,
        type: "orders",
        currentPage: page,
        totalPage,
        hasLastPage,
        hasNextPage,
        nextPage: page + 1,
        lastPage: page - 1,
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async getBookingHistory(req, res) {
    console.log("Get restaurant booking history");
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      let restBookingHistory = await this.restService.getRestBookingHistory(1);
      let totalRecords = restBookingHistory.length;
      console.log("Total booking history records", totalRecords);
      const totalPage = Math.ceil(totalRecords / limit);
      const hasLastPage = totalPage > 1 && page !== 1 ? true : false;
      const hasNextPage = totalPage > 1 && page !== totalPage ? true : false;

      const restBookingHistoryResult = restBookingHistory.slice(
        startIndex,
        endIndex
      );
      console.log("Rest booking history", restBookingHistoryResult);

      return res.render("restBookingHistory", {
        layout: "restaurant",
        restBookingHistory: restBookingHistoryResult,
        type: "bookingshistory",
        currentPage: page,
        totalPage,
        hasLastPage,
        hasNextPage,
        nextPage: page + 1,
        lastPage: page - 1,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getOrderHistory(req, res) {
    console.log("Get restaurant order history");
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      let restOrderHistory = await this.restService.getRestOrderHistory(1);
      let totalRecords = restOrderHistory.length;
      console.log("Total order history records", totalRecords);
      const totalPage = Math.ceil(totalRecords / limit);
      const hasLastPage = totalPage > 1 && page !== 1 ? true : false;
      const hasNextPage = totalPage > 1 && page !== totalPage ? true : false;

      const restOrderHistoryResult = restOrderHistory.slice(
        startIndex,
        endIndex
      );
      console.log("Rest order history", restOrderHistoryResult);

      return res.render("restOrderHistory", {
        layout: "restaurant",
        restOrderHistory: restOrderHistoryResult,
        type: "ordershistory",
        currentPage: page,
        totalPage,
        hasLastPage,
        hasNextPage,
        nextPage: page + 1,
        lastPage: page - 1,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  updateBookingStatus(req, res) {
    console.log("Update booking status");
    try {
      return this.restService
        .updateBookingStatus(req.body.bookingId, req.body.bookingStatus)
        .then(() => {
          res.send("DONE");
        });
    } catch (error) {
      throw new Error(error);
    }
  }

  updateOrderStatus(req, res) {
    console.log("Update order status");
    try {
      return this.restService
        .updateOrderStatus(req.body.orderId, req.body.orderStatus)
        .then(() => {
          res.send("DONE");
        });
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = RestRouter;
