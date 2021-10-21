// Remove duplicate in booking status dropdown list
$(".bookingStatus")
  .on("change", function () {
    $("option:selected", this).hide().siblings().show();
  })
  .trigger("change");

// Remove duplicate in order status dropdown list
$(".orderStatus")
  .on("change", function () {
    $("option:selected", this).hide().siblings().show();
  })
  .trigger("change");

// For submit booking status
$(".btn-restSubmitBooking").on("click", (e) => {
  let bookingId = e.target.id;
  console.log(bookingId);
  let bookingStatus = $(e.target).prev().find("option:selected").text();
  console.log(bookingStatus);

  $.ajax({
    url: `/biz/bookings/${bookingId}`,
    type: "PUT",
    data: { bookingId: bookingId, bookingStatus: bookingStatus },
    success: function (res) {
      console.log(res);
      setTimeout("location.reload(true)", 500);
    },
  });
});

// For submit order status
$(".btn-restSubmitOrder").on("click", (e) => {
  let orderId = e.target.id;
  console.log(orderId);
  let orderStatus = $(e.target).prev().find("option:selected").text();
  console.log(orderStatus);

  $.ajax({
    url: `/biz/orders/${orderId}`,
    type: "PUT",
    data: { orderId: orderId, orderStatus: orderStatus },
    success: function (res) {
      console.log(res);
      setTimeout("location.reload(true)", 500);
    },
  });
});
