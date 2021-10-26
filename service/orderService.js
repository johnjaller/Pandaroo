class OrderService {
  constructor(knex) {
    this.knex = knex;
  }
  getDeliveryStatus(restId) {
    return this.knex("restaurant").select("delivery").where("id", restId);
  }
  getRestDetail(restId) {
    return this.knex("restaurant").select().where("id", restId);
  }
  getRestRating(restId) {
    return this.knex("review").where("rest_id", restId);
  }
  getUserBookmarkStatus(userId, restId) {
    return this.knex("bookmark")
      .select()
      .where({ account_id: userId, rest_id: restId });
  }
  getRestDishes(restId, category) {
    return this.knex("restaurant")
      .select()
      .join("menu", "restaurant.id", "menu.rest_id")
      .where({ "restaurant.id": restId, category: category });
  }
  putCacncelOrder(orderId) {
    return this.knex("delivery")
      .update("order_status", "Cancelled")
      .where("delivery_id", orderId);
  }
}
module.exports = OrderService;
