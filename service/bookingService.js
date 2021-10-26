class BookingService {
  constructor(knex) {
    this.knex = knex;
  }

  getRestDetail(restId) {
    return this.knex("restaurant").select().where("id", restId);
  }

  getUserBookmarkStatus(userId, restId) {
    return this.knex("bookmark")
      .select()
      .where({ account_id: userId, rest_id: restId });
  }

  getRestRating(restId) {
    return this.knex("review").where("rest_id", restId);
  }

  getRestDishes(restId, category) {
    return this.knex("restaurant")
      .select()
      .join("menu", "restaurant.id", "menu.rest_id")
      .where({ "restaurant.id": restId, category: category });
  }
  insertBooking(
    restId,
    userId,
    bookingTime,
    bookingDate,
    specialRequest,
    noOfGuest,
    bookingStatus
  ) {
    return this.knex("booking")
      .insert({
        rest_id: restId,
        account_id: userId,
        booking_time: bookingTime,
        booking_date: bookingDate,
        special_request: specialRequest,
        no_of_ppl: noOfGuest,
        booking_status: bookingStatus,
      })
      .returning("id");
  }
  insertBookingDetail(bookingId, menuId, amount) {
    return this.knex("booking_detail").insert({
      booking_id: bookingId,
      menu_id: menuId,
      quantity: amount,
    });
  }

  putBooking(bookingId) {
    return this.knex("booking")
      .update("booking_status", "Cancelled")
      .where("id", bookingId);
  }
}

module.exports = BookingService;
