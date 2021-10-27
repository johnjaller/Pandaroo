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

  // Get rest setup info "/bizsetup"
  getRestSetUpInfo(restId) {
    console.log("restService restId: ", restId);
    return this.knex("restaurant")
      .select(
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
      )
      .where("restaurant.id", restId);
  }

  async getRestTag(restId) {
    console.log("restService restId: ", restId);
    let tagQuery = await this.knex("tag_rest_join")
      .join("tag", "tag_rest_join.tag_id", "tag.id")
      .select("tag.tag_name")
      .where("tag_rest_join.rest_id", restId);
    console.log(tagQuery);
    if (tagQuery) {
      return tagQuery;
    } else {
      return { message: "Tag not found" };
    }
  }

  getRestCurrentBooking(restId) {
    let query = this.knex("booking")
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
    return query.then((data) => {
      for (let i = 0; i < data.length; i++) {
        data[i]["booking_date"] = data[i]["booking_date"].toLocaleDateString();
      }
      return data;
    });
  }

  getRestBookingHistory(restId) {
    let query = this.knex("booking")
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
    return query.then((data) => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        data[i]["booking_date"] = data[i]["booking_date"].toLocaleDateString();
      }
      return data;
    });
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
            created_at: new Date(
              Date.parse(result[i][0].created_at)
            ).toLocaleString(),
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
            created_at: new Date(
              Date.parse(result[i][0].created_at)
            ).toLocaleString(),
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

  getMenu(restId, category) {
    return this.knex("menu")
      .join("restaurant", "restaurant.id", "menu.rest_id")
      .select(
        "menu.id",
        "menu.item",
        "menu.price",
        "menu.category",
        "menu.photo_path"
      )
      .where("restaurant.id", restId)
      .andWhere("category", category)
      .orderBy("menu.id");
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
    } catch (error) {
      throw new Error(error);
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
    } catch (error) {
      throw new Error("User does not exist, cannot delete restaurant tag");
    }
  }

  async insertRestTag(restId, data) {
    try {
      console.log("restService insertRestTag data: ", data);
      console.log("restService", data["restTag[]"]);
      let tagArr = data["restTag[]"];
      if (Array.isArray(tagArr)) {
        let tagIdArr = [];
        for (let i = 0; i < tagArr.length; i++) {
          let tagId = await this.knex
            .select("id")
            .from("tag")
            .where("tag_name", tagArr[i]);
          tagIdArr.push(tagId[0].id);
          console.log("tagId: ", tagId[0].id);
        }
        console.log("restService tagIdArr: ", tagIdArr);
        for (let j = 0; j < tagIdArr.length; j++) {
          console.log("Adding into joint table");
          await this.knex("tag_rest_join").insert({
            rest_id: restId,
            tag_id: tagIdArr[j],
          });
        }
      } else if (typeof tagArr === "string") {
        let tagIdQuery = await this.knex
          .select("id")
          .from("tag")
          .where("tag_name", tagArr);
        console.log("insertRestTag tagIdQuery: ", tagIdQuery[0]);
        if (tagIdQuery[0]) {
          await this.knex("tag_rest_join").insert({
            rest_id: restId,
            tag_id: tagIdQuery[0].id,
          });
        }
      }
    } catch (error) {
      throw new Error("User does not exist, cannot insert restaurant tag");
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
      throw new Error(error);
    }
  }

  editRestMenu(dishname, dishprice, dishId) {
    return this.knex("menu")
      .update({
        item: dishname,
        price: dishprice,
      })
      .where("id", dishId);
  }

  deleteRestMenu(dishId) {
    return this.knex("menu").where("id", dishId).del();
  }
}

module.exports = RestService;
