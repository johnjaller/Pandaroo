const express = require("express");

const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

// Set up multer and S3 bucket
const multer = require("multer");
const upload = multer({ dest: "../uploads/" });
const { uploadFile, downloadFile } = require("../s3Bucket/s3");

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
    router.post("/bizaddmenu"), upload.single("uploadedPhoto"), this.postRestMenu.bind(this);

    return router;
  }

  async get(req, res) {
    console.log("Get restaurant info");
    try {
      let restInfo = await this.restService.getRestInfo(1);
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
      const limit = 3;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      let restOrder = await this.restService.getRestCurrentOrder(1);
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
      const limit = 3;
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

  async getRestSetUp(req, res) {
    return res.render("restSetUp", {
      layout: "restaurant",
    });
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

    console.log("restRouter: Updating restaurant discount");
    await this.restService.updateRestDiscount(req.user.id, req.body);

    console.log("restRouter: Updating restaurant tag");
    await this.restService
      .deleteRestTag(req.user.id)
      .then(() => {
        console.log("Deleted restaurant tag");
        this.restService.insertRestTag(req.user.id, req.body);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
    res.redirect("/biz/info");
  }

  // Add menu
  async postRestMenu(req, res) {
    try {
      console.log("restRouter req.file: ", req.file);
      const file = req.file;
      let result = await uploadFile(file);
      console.log(result);
  
      await 
      await unlinkFile(file.path);
      res.redirect("/biz/bizsetup");
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = RestRouter;
