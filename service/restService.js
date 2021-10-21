class RestService {
  constructor(knex) {
    this.knex = knex;
  }

  // Get rest homepage "/info"
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

  // Get rest setup info (with tag) "/bizsetup"
  getRestSetUpInfo(restId) {
    console.log("restService restId: ", restId);
    return (
      this.knex("restaurant")
        // .join("tag_rest_join", "restaurant.id", "tag_rest_join.rest_id")
        // .join("tag", "tag_rest_join.tag_id", "tag.id")
        .select(
          // "profile_path",
          "name",
          "description",
          "address",
          "district",
          "phone_no",
          "opening_time",
          "closing_time",
          "seats",
          "delivery",
          "code",
          "discount",
          "description"
          // this.knex.raw("ARRAY_AGG(tag.tag_name) as tag")
        )
        .where("restaurant.id", restId)
      // .whereRaw("restaurant.id = ?", [restId])
      // .groupBy("restaurant.id", restId)
    );
  }

  async postRestInit(restId) {
    try {
      console.log("restService restId: ", restId);
      return await this.knex("restaurant").where("id", restId).update({
        name: null,
        description: null,
        address: null,
        district: null,
        phone_no: null,
        opening_time: null,
        closing_time: null,
        seats: null,
        delivery: null,
        code: null,
        discount: null,
        description: null,
      });
    } catch (err) {
      console.log(err);
    }
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
        "booking.special_request",
        "booking.booking_status"
      )
      .where(function () {
        this.whereNot("booking.booking_status", "Completed").andWhereNot(
          "booking.booking_status",
          "Cancelled"
        );
      })
      .andWhere("booking.rest_id", restId)
      .orderBy("booking.id");
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
        this.where("booking.booking_status", "Completed").orWhere(
          "booking.booking_status",
          "Cancelled"
        );
      })
      .andWhere("booking.rest_id", restId)
      .orderBy("booking.id");
  }

  getRestCurrentOrder(restId) {
    let query = this.knex("delivery")
      .join("order_detail", "delivery_id", "delivery.id")
      .join("menu", "menu.id", "menu_id")
      .select(
        "delivery.id",
        "delivery.created_at",
        "menu.item",
        "order_detail.quantity",
        "delivery.total_amount",
        "delivery.special_request",
        "delivery.order_status"
      )
      .where(function () {
        this.whereNot("order_status", "Delivered").andWhereNot(
          "order_status",
          "Cancelled"
        );
      })
      .andWhere("delivery.rest_id", restId)
      .orderBy("delivery.id");
    return query.then((data) => {
      console.log("Order list", data);
      if (data.length > 0) {
      let result = [];
      let last = 0;
      for (let i = 1; i < data.length; i++) {
        if (data[i].id !== data[i - 1].id) {
          result.push(data.slice(last, i));
          last = i;
        }
      }
      result.push(data.slice(last));

      let orderList = [];
      for (let i = 0; i < result.length; i++) {
        let eachOrder = {
          id: result[i][0].id,
          created_at: result[i][0].created_at,
          total_amount: result[i][0].total_amount,
          order_status: result[i][0].order_status,
          special_request: result[i][0].special_request,
          items: [],
        };
        result[i].map((dish) => {
          let food = { item: dish.item, quantity: dish.quantity };
          eachOrder.items.push(food);
        });
        orderList.push(eachOrder);
      }
      return orderList;
    } else {
      let orderList = [];
      return orderList;
      }
    });
  }
//
  getRestOrderHistory(restId) {
    let query = this.knex("delivery")
      .join("order_detail", "delivery.id", "delivery_id")
      .join("menu", "menu_id", "menu.id")
      .select(
        "delivery.id",
        "delivery.created_at",
        "menu.item",
        "order_detail.quantity",
        "delivery.total_amount",
        "delivery.special_request",
        "delivery.order_status"
      )
      .where(function () {
        this.where("order_status", "Delivered").orWhere(
          "order_status",
          "Cancelled"
        );
      })
      .andWhere("delivery.rest_id", restId)
      .orderBy("delivery.id");
    return query.then((data) => {
      console.log("Order list", data);
      if (data.length > 0) {
      let result = [];
      let last = 0;
      for (let i = 1; i < data.length; i++) {
        if (data[i].id !== data[i - 1].id) {
          result.push(data.slice(last, i));
          last = i;
        }
      }
      result.push(data.slice(last));

      let orderList = [];
      for (let i = 0; i < result.length; i++) {
        let eachOrder = {
          id: result[i][0].id,
          created_at: result[i][0].created_at,
          total_amount: result[i][0].total_amount,
          order_status: result[i][0].order_status,
          special_request: result[i][0].special_request,
          items: [],
        };
        result[i].map((dish) => {
          let food = { item: dish.item, quantity: dish.quantity };
          eachOrder.items.push(food);
        });
        orderList.push(eachOrder);
      }
      return orderList;
    } else {
      let orderList = [];
      return orderList;
      }
    });
  }

  getMenu(restId, category) {
    return this.knex("menu")
      .join("restaurant", "restaurant.id", "menu.rest_id")
      .select("menu.item", "menu.price", "menu.photo_path")
      .where("restaurant.id", restId)
      .andWhere("category", category);
  }

  updateBookingStatus(bookingId, bookingStatus) {
    return this.knex("booking")
      .update("booking_status", bookingStatus)
      .orderBy("id")
      .where("id", bookingId);
  }

  updateOrderStatus(orderId, orderStatus) {
    return this.knex("delivery")
      .update("order_status", orderStatus)
      .orderBy("id")
      .where("id", orderId);
  }

  // Edit rest setup info (with tag) "/bizsetup"
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
      return new Error(err);
    }
  }

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
      return new Error("User does not exist, cannot delete restaurant tag");
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
      return new Error("User does not exist, cannot insert restaurant tag");
    }
  }

  // Post rest menu "/bizsetupmenu"
  async addRestMenu(restId, data, result) {
    try {
      await this.knex("menu")
        .insert({
          item: data.restMenuItem,
          rest_id: restId,
          price: data.restMenuPrice,
          category: data.restMenuCategory,
          profile_path: result.Key,
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
