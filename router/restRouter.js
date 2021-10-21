const express = require("express");

// const fs = require("fs");
// const util = require("util");
// const unlinkFile = util.promisify(fs.unlink);

// // Set up multer and S3 bucket
// const multer = require("multer");
// const upload = multer({ dest: "../uploads/" });
// const { uploadFile } = require("../s3Bucket/s3");

class RestRouter {
  constructor(restService) {
    this.restService = restService;
  }

  router() {
    let router = express.Router();

    router.get("/info", this.get.bind(this));
    router.get("/bookings", this.getBooking.bind(this));
    router.get("/orders", this.getOrder.bind(this));
    router.get("/bookingshistory", this.getBookingHistory.bind(this));
    router.get("/ordershistory", this.getOrderHistory.bind(this));
    router.get("/bizsetup", this.getRestSetUp.bind(this));
    router.put("/bizsetup", this.putRestInfo.bind(this));

    router.get("/bizsetupmenu", this.getSetUpMenu.bind(this));
    // router.post("/bizaddmenu"),
    //   upload.single("uploadedPhoto"),
    //   this.postRestMenu.bind(this);

    return router;
  }

  async get(req, res) {
    console.log("Get restaurant info");
    try {
      let restInfo = await this.restService.getRestInfo(req.user.id);
      if (restInfo[0]["delivery"]) {
        restInfo[0]["delivery"] = "Yes";
      } else {
        restInfo[0]["delivery"] = "No";
      }
      console.log("Rest info", restInfo);
      return res.render("restInfo", {
        layout: "restaurant",
        restInfo: restInfo,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getBooking(req, res) {
    console.log("Get restaurant current booking");
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 2;
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

  async getOrder(req, res) {
    console.log("Get restaurant current order");
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 3;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      let restOrder = await this.restService.getRestCurrentOrder(req.user.id);
      let totalRecords = restOrder.length;
      console.log("Total order records", totalRecords);
      const totalPage = Math.ceil(totalRecords / limit);
      const hasLastPage = totalPage > 1 && page !== 1 ? true : false;
      const hasNextPage = totalPage > 1 && page !== totalPage ? true : false;

      const restOrderResult = restOrder.slice(startIndex, endIndex);
      console.log("Rest order", restOrderResult);

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
      throw new Error(error);
    }
  }

  async getBookingHistory(req, res) {
    console.log("Get restaurant booking history");
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 3;
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

  async getOrderHistory(req, res) {
    console.log("Get restaurant order history");
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 3;
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
        layout: "restaurant",
        restInfo: restInfo,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getSetUpMenu(req, res) {
    return res.render("restSetUpMenu", {
      layout: "restaurant",
    });
  }

  // Update restaurant info
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

  // Add menu
  // async postRestMenu(req, res) {
  //   console.log("Receiving rest set menu req..");
  //   try {
  //     console.log("restRouter req.file: ", req.file);
  //     const file = req.file;
  //     let result = await uploadFile(file);
  //     console.log(result);

  //     await this.restService.addRestMenu(req.user.id, req.body, result);

  //     // Unlink imagefile at /uploads
  //     // await unlinkFile(file.path);
  //     console.log("Update menu done");
  //     res.redirect("/biz/bizsetupmenu");
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // }
}

module.exports = RestRouter;
