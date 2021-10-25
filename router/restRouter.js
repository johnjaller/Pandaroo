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

    router.get("/bizsetup", this.getRestSetUp.bind(this));
    router.put("/bizsetup", this.putRestInfo.bind(this));
    router.use("/biztag", this.getBizTag.bind(this));

    router.get("/bizsetupmenu", this.getSetUpMenu.bind(this));
    router.get(
      "/bizsetupmenu/:category",
      this.getSetUpMenuWithCategory.bind(this)
    );
    router.put("/bizsetupmenu/:category", this.editMenu.bind(this));
    router.delete("/bizsetupmenu/:category", this.deleteMenu.bind(this));

    return router;
  }

  // Get "/info"
  async get(req, res) {
    console.log("Get restaurant info");
    try {
      let restInfo = await this.restService.getRestInfo(req.user.id);
      let dishInfo = await this.restService.getMenu(req.user.id, "soup&salad");
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

  // Get "/info/:category"
  async getCategory(req, res) {
    console.log(req.params.category);
    console.log("Get restaurant menu");
    try {
      let restInfo = await this.restService.getRestInfo(req.user.id);
      let dishInfo = await this.restService.getMenu(
        req.user.id,
        req.params.category
      );
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

  // Get "/bookings"
  async getBooking(req, res) {
    console.log("Get restaurant current booking");
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      let restBooking = await this.restService.getRestCurrentBooking(
        req.user.id
      );
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

  // Get "/orders"
  async getOrder(req, res) {
    console.log("Get restaurant current order");
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      let restOrder = await this.restService.getRestCurrentOrder(req.user.id);
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

  // Get "/bookingshistory"
  async getBookingHistory(req, res) {
    console.log("Get restaurant booking history");
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      let restBookingHistory = await this.restService.getRestBookingHistory(
        req.user.id
      );
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

  // Get "/ordershistory"
  async getOrderHistory(req, res) {
    console.log("Get restaurant order history");
    console.log("Req user", req.user.id);
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      let restOrderHistory = await this.restService.getRestOrderHistory(
        req.user.id
      );
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

  // Get "/bookings/:bookingID"
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

  // Get "/orders/:orderID"
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

  // Get "/biztag"
  async getBizTag(req, res) {
    console.log("Get tag");
    try {
      let tagInfo = await this.restService.getRestTag(req.user.id);
      if (tagInfo.length > 0) {
        res.send({ data: tagInfo });
        console.log("restRouter getBizTag tagInfo: ", tagInfo);
      } else {
        res.sendStatus(200);
        console.log("restRouter getBizTag No tagInfo");
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Get "/bizsetup"
  async getRestSetUp(req, res) {
    try {
      console.log("Get restaurant info");
      let restInfo = await this.restService.getRestSetUpInfo(req.user.id);
      console.log(restInfo, "<<<<< rest info");
      // Convert delivery T/F to Yes/No
      if (restInfo[0]["delivery"]) {
        restInfo[0]["delivery"] = "Yes";
      } else {
        restInfo[0]["delivery"] = "No";
      }
      // Convert discount decimal to %
      let discount = restInfo[0]["discount"];
      switch (discount) {
        case "0.10":
          restInfo[0]["discount"] = "90% Off";
          break;
        case "0.20":
          restInfo[0]["discount"] = "80% Off";
          break;
        case "0.30":
          restInfo[0]["discount"] = "70% Off";
          break;
        case "0.40":
          restInfo[0]["discount"] = "60% Off";
          break;
        case "0.50":
          restInfo[0]["discount"] = "50% Off";
          break;
        case "0.60":
          restInfo[0]["discount"] = "40% Off";
          break;
        case "0.70":
          restInfo[0]["discount"] = "30% Off";
          break;
        case "0.80":
          restInfo[0]["discount"] = "20% Off";
          break;
        case "0.90":
          restInfo[0]["discount"] = "10% Off";
          break;
        default:
          restInfo[0]["discount"] = "None";
      }
      console.log("restInfo", restInfo);
      return res.render("restSetUp", {
        layout: "restSetUpLayout",
        restInfo: restInfo,
      });
    } catch (err) {
      console.log(err);
    }
  }

  // Put "/bizsetup"
  async putRestInfo(req, res) {
    console.log("restRouter req.user.id: ", req.user.id);

    console.log("restRouter: Updating restaurant info");
    await this.restService.updateRestInfo(req.user.id, req.body);

    console.log("restRouter: Updating restaurant tag");
    await this.restService
      .deleteRestTag(req.user.id)
      .then(() => {
        console.log("Deleted restaurant tag");
        this.restService.insertRestTag(req.user.id, req.body);
        res.status(200);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  // Get "/bizsetupmenu"
  async getSetUpMenu(req, res) {
    let dishInfo = await this.restService.getMenu(req.user.id, "soup&salad");
    return res.render("restSetUpMenu", {
      layout: "restaurant",
      dishInfo: dishInfo,
    });
  }

  // Get "/bizsetupmenu/:category"
  async getSetUpMenuWithCategory(req, res) {
    console.log("Get restaurant menu in setup");
    try {
      let dishInfo = await this.restService.getMenu(
        req.user.id,
        req.params.category
      );
      console.log("Dish info", dishInfo);
      return res.render("restSetUpMenu", {
        layout: "restaurant",
        dishInfo: dishInfo,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // Put "/bizsetupmenu/:category"
  async editMenu(req, res) {
    console.log("Update restaurant menu");
    try {
      return this.restService
        .editRestMenu(req.body.dishname, req.body.dishprice, req.body.dishId)
        .then(() => {
          res.send("DONE");
        });
    } catch (error) {
      throw new Error(error);
    }
  }

  // Delete "/bizsetupmenu/:category"
  async deleteMenu(req, res) {
    console.log("Delete restaurant menu");
    try {
      return this.restService.deleteRestMenu(req.body.dishId).then(() => {
        res.send("DONE");
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = RestRouter;
