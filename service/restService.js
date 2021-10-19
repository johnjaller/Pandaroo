const { default: knex } = require("knex");

class RestService {
  constructor(knex) {
    this.knex = knex;
  }

  getRestInfo(restId) {
    return this.knex
      .select(
        "profile_path",
        "name",
        "description",
        "address",
        "district",
        "phone_no",
        "opening_time",
        "closing_time",
        "seats",
        "delivery"
      )
      .from("restaurant")
      .where("id", restId);
  }

  getRestCurrentBooking(restId) {
    return this.knex("booking")
      .join("account", "account_id", "account.id")
      .select(
        "booking.id",
        "account.firstname",
        "account.surname",
        "booking.no_of_ppl",
        "booking.booking_date",
        "booking.booking_time",
        "booking.special_request"
      )
      .where("rest_id", restId);
  }

  getRestBookingHistory(restId) {
    return this.knex("booking")
      .join("account", "account_id", "account.id")
      .select(
        "booking.id",
        "account.firstname",
        "account.surname",
        "booking.no_of_ppl",
        "booking.booking_date",
        "booking.booking_time",
        "booking.special_request",
        "booking.booking_status"
      )
      .where(function () {
        this.where("booking_status", "Completed").orWhere(
          "booking_status",
          "Cancelled"
        );
      })
      .andWhere("rest_id", restId);
  }

  getRestCurrentOrder(restId) {
    return this.knex("delivery")
      .join("order_detail", "delivery_id", "delivery.id")
      .join("menu", "menu.id", "menu_id")
      .select(
        "delivery.id",
        "delivery.created_at",
        "menu.item",
        "order_detail.quantity",
        "delivery.special_request"
      )
      .where("delivery.rest_id", restId);
  }

  getRestOrderHistory(restId) {
    return this.knex("delivery")
      .join("order_detail", "delivery.id", "delivery_id")
      .join("menu", "menu_id", "menu.id")
      .select(
        "delivery.id",
        "delivery.created_at",
        "menu.item",
        "order_detail.quantity",
        "delivery.special_request",
        "delivery.order_status"
      )
      .where(function () {
        this.where("order_status", "Delivered").orWhere(
          "order_status",
          "Cancelled"
        );
      })
      .andWhere("delivery.rest_id", restId);
  }

  // Update restaurant info
  async updateRestInfo(restId, data) {
    try {
      console.log(restId);
      return await this.knex("restaurant").where("id", restId).update({
        name: data.restName,
        address: data.restAddress,
        district: data.restDistrict,
        phone_no: data.restPhone,
        opening_time: data.restOpening,
        closing_time: data.restClosing,
        seats: data.restSeat,
        description: data.restAbout,
        delivery: data.restDelivery,
        code: data.restDiscountCode,
        discount: data.restDiscount,
      });
    } catch (err) {
      console.log(err);
      throw new Error("User does not exist, cannot edit restaurant info!");
    }
  }

  // async updateRestDiscount(restId, data) {
  //   try {
  //     let discountQuery = await this.knex("discount").where("rest_id", restId);
  //     if (discountQuery.length == 0) {
  //       await this.knex("discount").insert({
  //         rest_id: restId,
  //         code: data.restDiscountCode,
  //         discount: data.restDiscount,
  //       });
  //     } else {
  //       await this.knex("discount")
  //         .update({
  //           code: data.restDiscountCode,
  //           discount: data.restDiscount,
  //         })
  //         .where("rest_id", restId);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     throw new Error("User does not exist, cannot edit restaurant discount!");
  //   }
  // }

  async deleteRestTag(restId) {
    try {
      let restTagQuery = await this.knex("tag_rest_join").where(
        "rest_id",
        restId
      );
      if (restTagQuery) {
        return await this.knex("tag_rest_join").where("rest_id", restId).del();
      }
    } catch (err) {
      throw new Error("User does not exist, cannot delete restaurant tag");
    }
  }

  async insertRestTag(restId, data) {
    try {
      console.log("158 restService", data["restTag[]"]);
      let tagArr = data["restTag[]"];
      let tagIdArr = [];
      for (let i = 0; i < tagArr.length; i++) {
        let tagId = await this.knex
          .select("id")
          .from("tag")
          .where("tag_name", tagArr[i]);
        tagIdArr.push(tagId[0].id);
        console.log("167 tagId: ", tagId[0].id);
      }
      console.log("167 restService tagIdArr: ", tagIdArr);
      for (let j = 0; j < tagIdArr.length; j++) {
        console.log("Adding into joint table");
        await this.knex("tag_rest_join").insert({
          rest_id: restId,
          tag_id: tagIdArr[j],
        });
      }
    } catch (err) {
      console.log(err);
      throw new Error("User does not exist, cannot insert restaurant tag");
    }
  }

  async addRestMenu(menuId, result) {
    try {
      await this.knex("menu_gallery")
        .insert({
          profile_path: result.Key,
          menu_id: menuId,
        })
        .then(() => {
          console.log("Inserting path done");
        });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = RestService;
