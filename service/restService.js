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
}

module.exports = RestService;
