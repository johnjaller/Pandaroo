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

// Restaurant - Get the information in card and put in modal
$(".btn-restEdit").on("click", (e) => {
  let d_item = $(e.target).parent().siblings().find(".d-item").text();
  let d_price = $(e.target).parent().siblings().find(".d-price").text();
  let d_Id = $(e.target).parent().siblings().find(".d-Id").text();
  let d_category = $(e.target).parent().siblings().find(".d-category").text();
  console.log(d_item);
  console.log(d_price);
  console.log(d_Id);
  console.log(d_category);
  $("#dishname").val(d_item);
  $("#dishprice").val(d_price);
  $("#dishid").text(d_Id);
  $("#dishcategory").text(d_category);
});

// Restaurant - Edit menu
$(".btn-restSubmit").on("click", (e) => {
  let dishname = $("#dishname").val();
  let dishprice = $("#dishprice").val();
  let dishId = $("#dishid").text();
  let dishcategory = $("#dishcategory").text();
  $.ajax({
    type: "PUT",
    url: `/biz/bizsetupmenu/${dishcategory}`,
    data: {
      dishname: dishname,
      dishprice: dishprice,
      dishId: dishId,
      dishcategory: dishcategory,
    },
    success: function (res) {
      location.reload(true);
    },
  });
});

// Restaurant - Delete menu
$(".btn-restDelete").on("click", (e) => {
  let dishId = $(e.target).parent().siblings().find(".d-Id").text();
  let dishcategory = $(e.target).parent().siblings().find(".d-category").text();
  $.ajax({
    type: "DELETE",
    url: `/biz/bizsetupmenu/${dishcategory}`,
    data: {
      dishId: dishId,
    },
    success: function (res) {
      location.reload(true);
    },
  });
});

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
