let shoppingCart = {};
let requestId;
let bookingCart = {};

//shoppingCart setup
$(document).ready(function () {
 
  let ratingArr = $(".rating");

  for (let i = 0; i < ratingArr.length; i++) {
    let rating = $(".rating").eq(i).html();
    switch (rating) {
      case "1" || 1:
        $(".rating")
          .eq(i)
          .html(
            '<i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>'
          );
        break;
      case "1.5" || 1.5:
        $(".rating")
          .eq(i)
          .html(
            '<i class="fas fa-star"><i class="fas fa-star-half-alt"></i></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>'
          );
        break;
      case "2" || 2:
        $(".rating")
          .eq(i)
          .html(
            '<i class="fas fa-star"><i class="fas fa-star"><i class="far fa-star"><i class="far fa-star"><i class="far fa-star">'
          );
        break;
      case "2.5" || 2.5:
        $(".rating")
          .eq(i)
          .html(
            '<i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star-half-alt"></i><i class="far fa-star"><i class="far fa-star">'
          );
        break;
      case "3" || 3:
        $(".rating")
          .eq(i)
          .html(
            `<i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star"><i class="far fa-star"><i class="far fa-star">`
          );
        break;
      case "3.5" || 3.5:
        $(".rating")
          .eq(i)
          .html(
            `<i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star-half-alt"></i><i class="far fa-star">`
          );
        break;
      case "4" || 4:
        $(".rating")
          .eq(i)
          .html(
            `<i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star"><i class="far fa-star">`
          );
        break;
      case "4.5" || 4.5:
        $(".rating")
          .eq(i)
          .html(
            `<i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star-half-alt"></i>`
          );
        break;
      case "5" || 5:
        $(".rating")
          .eq(i)
          .html(
            `<i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star">`
          );
        break;
      default:
        $(".rating")
          .eq(i)
          .html(
            `<i class="far fa-star"><i class="far fa-star"><i class="far fa-star"><i class="far fa-star"><i class="far fa-star">`
          );
        break;
    }
  }

  if (window.location.pathname.includes("/order/")) {
    let currentTime = new Date();

    let opening = $(".opening").html().split(":");
    let closing = $(".closing").html().split(":");
    let openingTime = new Date().setHours(opening[0], opening[1], opening[2]);
    let closingTime = new Date().setHours(closing[0], closing[1], closing[2]);

    if (currentTime < openingTime || currentTime > closingTime) {
      let closedModal = new bootstrap.Modal($('#closed'))
          closedModal.show()
      $(".checkout").attr("disabled", true);
      $(".couponCheck").attr("disabled", true);
      $("#discountCode").attr("disabled", true);
      $("#specialRequest").attr("disabled", true);
      $(".addToCart").attr("disabled", true);
      $(".alert").html(
        "The restaurant is closed. Please order within opening hours. However, you still can book a table from restaurant"
      );
      $(".alert").show();
    }
    if (
      !localStorage.hasOwnProperty("shoppingCart")
    ) {
      localStorage.setItem("shoppingCart", "{}");
      shoppingCart = {};
    } else {
      shoppingCart = JSON.parse(localStorage.getItem("shoppingCart"));
    }

    requestId = window.location.pathname.replace(/[^\d]/g, "");

    if (shoppingCart.hasOwnProperty(requestId)) {
      shoppingCart[requestId].item.forEach((item) => {
        $(".orderList")
          .append(`<tr class="dish text-center"><td>${item.name}</td><td>${item.amount}</td><td>HKD ${item.price}</td><td><i class="fas fa-trash-alt orderDelete"></i>
        </td></tr>`);
      });
      let price;
      if (Object.keys(shoppingCart[requestId].discount).length > 0) {
        price = shoppingCart[requestId].item
          .map((i) => i.price * i.amount)
          .reduce((a, b) => a + b);
        let coupon = shoppingCart[requestId].discount;
        let discount = coupon.percent_off * 100;
        $(".discountList").append(
          `<tr class="dish text-center"><td>Discount: '${coupon.discountCode}'</td><td></td><td>-${discount}%</td><td><i class="fas fa-trash-alt couponDelete"></i></td></tr>`
        );
        $("#discountCode").prop("disabled", "disabled");
        $(".couponCheck").addClass("disabled");
        price = Number((price * (1 - Number(coupon.percent_off))).toFixed(1));
      } else {
        price = shoppingCart[requestId].item
          .map((i) => i.price * i.amount)
          .reduce((a, b) => a + b);
      }
      $(".totalPrice").html(`HKD ${price}`);
    } else {
      return false;
    }
  } else if (window.location.pathname.includes("/booking/")) {
    let opening = $(".opening").html().split(":");
    let closing = $(".closing").html().split(":");
    let openingTime = new Date().setHours(opening[0], opening[1], opening[2]);
    console.log(openingTime)
    console.log(new Date(openingTime).toTimeString().slice(0,5))
    let closingTime = new Date().setHours(closing[0], closing[1], closing[2]);
    $('#dateOfBooking').attr('min', new Date().toISOString().split("T")[0]);
    $('#timeOfBooking').attr('min', new Date(openingTime).toTimeString().slice(0,5));
    $('#timeOfBooking').attr('max', new Date(closingTime).toTimeString().slice(0,5));
    if (
      !localStorage.hasOwnProperty("bookingCart") 
    ) {
      localStorage.setItem("bookingCart", "{}");
      bookingCart = {};
    } else {
      bookingCart = JSON.parse(localStorage.getItem("bookingCart"));
    }
    console.log(bookingCart);
    requestId = window.location.pathname.replace(/[^\d]/g, "");

    console.log(requestId);
    if (bookingCart.hasOwnProperty(requestId)) {
      console.log(bookingCart[requestId]);
      bookingCart[requestId].item.forEach((item) => {
        $(".bookingList")
          .append(`<tr class="dish text-center"><td>${item.name}</td><td>${item.amount}</td><td>HKD ${item.price}</td><td><i class="fas fa-trash-alt bookingDelete"></i>
    </td></tr>`);
      });
      let price;
      price = bookingCart[requestId].item
        .map((i) => i.price * i.amount)
        .reduce((a, b) => a + b);
      $(".totalPrice").html(`HKD ${price}`);
    } else {
      return false;
    }
  } else if (window.location.pathname.includes("/success/")) {
    let deleteId = window.location.pathname.replace(/[^\d]/g, "");
    delete shoppingCart[deleteId];
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  } else if (window.location.pathname.includes("/user/")) {
    console.log($(".orderStatus").html());
    if ($(".orderStatus").html() === "Preparing") {
      $(".orderStatus").attr("style", "background:green !important");
    }
  } else {
    return false;
  }
});

// Add to cart
$(".addToCart").on("click", (event) => {
  console.log($(event.target).parent().find(".item-name").html());
  let dishAmount;
  let dishPrice;
  let dishName;
  let dishMenuId;
  dishName = $(event.target).parent().find(".item-name").html();
  if (shoppingCart.hasOwnProperty(requestId)) {
    let cart = shoppingCart[requestId].item;
    console.log(dishName);
    let cartItemList = cart.map((item) => item.name);
    if (cartItemList.includes(dishName)) {
      dishPrice = cart[cartItemList.indexOf(dishName)].price;
      console.log(shoppingCart);
      cart[cartItemList.indexOf(dishName)].amount++;
      dishAmount = cart[cartItemList.indexOf(dishName)].amount;
      let item = $(".orderList")
        .find("tr")
        .find(`td:contains(${dishName})`)
        .parent();
      $(item).html(
        `<td>${dishName}</td><td>${dishAmount}</td><td>HKD ${dishPrice}</td><td><i class="fas fa-trash-alt orderDelete"></i>
          </td>`
      );
    } else {
      dishAmount = 1;
      dishPrice = Number(
        $(event.target).parent().find(".item-price").html().replace("HKD ", "")
      );
      console.log(dishPrice);
      dishMenuId = Number(
        $(event.target).parent().find(".item-name").attr("id")
      );
      console.log(dishMenuId);
      let dishItem = {
        name: dishName,
        price: dishPrice,
        amount: dishAmount,
        menuId: dishMenuId,
      };
      cart.push(dishItem);
      $(".orderList").append(
        `<tr class="dish text-center"><td>${dishName}</td><td>${dishAmount}</td><td>HKD ${dishPrice}</td><td><i class="fas fa-trash-alt orderDelete"></i>
          </td></tr>`
      );
    }
  } else {
    shoppingCart[requestId] = { item: [], specialRequest: "", discount: {} };
    let cart = shoppingCart[requestId].item;
    dishAmount = 1;
    dishPrice = Number(
      $(event.target).parent().find(".item-price").html().replace("HKD ", "")
    );
    console.log(dishPrice);
    dishMenuId = Number($(event.target).parent().find(".item-name").attr("id"));
    let dishItem = {
      name: dishName,
      price: dishPrice,
      amount: dishAmount,
      menuId: dishMenuId,
    };
    cart.push(dishItem);
    $(".orderList").append(
      `<tr class="dish text-center"><td>${dishName}</td><td>${dishAmount}</td><td>HKD ${dishPrice}</td><td><i class="fas fa-trash-alt orderDelete"></i>
        </td></tr>`
    );
  }
  console.log(dishPrice);
  let price = shoppingCart[requestId].item
    .map((i) => i.price * i.amount)
    .reduce((a, b) => a + b);
  if (Object.keys(shoppingCart[requestId].discount).length > 0) {
    price = Number(
      (price * (1 - shoppingCart[requestId].discount.percent_off)).toFixed(1)
    );
  }
  $(".totalPrice").html(`HKD ${price}`);
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
});
$("#userOrderForm").submit(function (e) {
  let price=Number($('.totalPrice').html().replace('HKD ',""))
  console.log(price)
  if(price>=4)
  {
  let request = $(".specialRequest").val();
  shoppingCart[requestId]["specialRequest"] = request;
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  order = [];
  console.log("running checkout");

  shoppingCart[requestId].item.forEach((dish) =>
    order.push({
      price_data: {
        currency: "hkd",
        product_data: {
          name: dish.name,
          metadata: { menu_id: dish.menuId },
        },
        unit_amount: dish.price * 100,
      },
      quantity: dish.amount,
    })
  );
  $(".userRest").val(requestId);
  console.log($(".userRest").val());
  $(".userOrder").val(JSON.stringify(order));
  if (Object.keys(shoppingCart[requestId].discount).length > 0) {
    let discount = shoppingCart[requestId].discount.percent_off * 100;
    $("#discount").val(
      JSON.stringify({
        name: shoppingCart[requestId].discount.discountCode,
        percent_off: discount,
      })
    );
  } else {
    $("#discount").val(JSON.stringify({}));
  }
  return true;
}else{
  let priceModal = new bootstrap.Modal($('#price'))
  priceModal.show()
  return false
}
});

//coupon
$(".couponCheck").on("click", function (event) {
  let couponCode = $("#discountCode").val();
  $("#discountCode").val("");
  console.log(couponCode);
  $.ajax({
    type: "post",
    url: "/discount/"+requestId,
    data: { code: couponCode },
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (response.percent_off === null) {
        let couponModal = new bootstrap.Modal($('#coupon'))
          couponModal.show()
      } else {
        $("#discountCode").prop("disabled", "disabled");
        $(event.target).addClass("disabled");
        let discount = response.percent_off * 100;
        if(shoppingCart.hasOwnProperty(requestId))
        {
        shoppingCart[requestId].discount = response;
        }
        else{
        shoppingCart[requestId] = { item: [], specialRequest: "", discount: {} }
        shoppingCart[requestId].discount = response;
        }
        $(".discountList").append(
          `<tr class="dish text-center"><td>Discount: '${couponCode}'</td><td></td><td>-${discount}%</td><td><i class="fas fa-trash-alt couponDelete"></i></td></tr>`
        );
        let price = shoppingCart[requestId].item
          .map((i) => i.price * i.amount)
          .reduce((a, b) => a + b);
        price = Number(
          (price * (1 - shoppingCart[requestId].discount.percent_off)).toFixed(
            1
          )
        );

        $(".totalPrice").html(`HKD ${price}`);

        localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
      }
    },
  });
});
$(".userLogout").on("click", function () {
  localStorage.clear();
});

//Add to Bookmark
$(".bookmark").on("click", (event) => {
  let restId = $(event.target).parent().attr("id");
  let icon = $(event.target);
  if (icon.hasClass("far")) {
    icon.toggleClass("far fas");
    console.log(restId);
    $.ajax({
      type: "POST",
      url: `/bookmark/${restId}`,
      success: function (response) {
        console.log(response);
      },
    });
  } else {
    icon.toggleClass("fas far");
    console.log(restId);
    $.ajax({
      type: "DELETE",
      url: `/bookmark/${restId}`,
      success: function (response) {
        console.log(response);
      },
    });
  }
});

//Cancel order
$(".userCancelOrder").on("click", (event) => {
  let cancelId = $(event.target).parents().closest(".userOrder").attr("id");
  $(".confirmCancelOrder").attr("id", cancelId);
});
$(".confirmCancelOrder").on("click", (event) => {
  let canelId = $(event.target).attr("id");
  $(event.target).removeAttr("id");
  console.log(canelId);
  $.ajax({
    type: "PUT",
    url: "/order/" + canelId,
    success: function (response) {
      console.log(response);
      if (response === "success") {
        $(`.userOrder#${canelId}`).remove();
      }
    },
  });
});

//Cancel booking
$(".userCancelBooking").on("click", (event) => {
  let cancelId = $(event.target).parents().closest(".userBooking").attr("id");
  $(".confirmCancelBooking").attr("id", cancelId);
});
$(".confirmCancelBooking").on("click", (event) => {
  let canelId = $(event.target).attr("id");
  $(event.target).removeAttr("id");
  console.log(canelId);
  $.ajax({
    type: "PUT",
    url: "/booking/" + canelId,
    success: function (response) {
      console.log(response);
      if (response === "success") {
        $(`.userBooking#${canelId}`).remove();
      }
    },
  });
});

//Unbookmark
$(".unbookmark").on("click", function (e) {
  let unbookmarkId = $(e.target).parents().closest(".userBookmark").attr("id");
  console.log(unbookmarkId);
  $.ajax({
    type: "DELETE",
    url: "/bookmark/" + unbookmarkId,
    success: function (response) {
      if (response === "success") {
        $(`.userBookmark#${unbookmarkId}`).remove();
      }
    },
  });
});

//Booking cart
$(".addToBookingCart").on("click", (event) => {
  console.log($(event.target).parent().find(".item-name").html());
  let dishAmount;
  let dishPrice;
  let dishName;
  let dishMenuId;
  dishName = $(event.target).parent().find(".item-name").html();
  if (bookingCart.hasOwnProperty(requestId)) {
    let cart = bookingCart[requestId].item;
    console.log(dishName);
    let cartItemList = cart.map((item) => item.name);
    if (cartItemList.includes(dishName)) {
      dishPrice = cart[cartItemList.indexOf(dishName)].price;
      console.log(shoppingCart);
      cart[cartItemList.indexOf(dishName)].amount++;
      dishAmount = cart[cartItemList.indexOf(dishName)].amount;
      let item = $(".bookingList")
        .find("tr")
        .find(`td:contains(${dishName})`)
        .parent();
      $(item).html(
        `<td>${dishName}</td><td>${dishAmount}</td><td>HKD ${dishPrice}</td><td><i class="fas fa-trash-alt bookingDelete"></i>
          </td>`
      );
    } else {
      dishAmount = 1;
      dishPrice = Number(
        $(event.target).parent().find(".item-price").html().replace("HKD ", "")
      );
      console.log(dishPrice);
      dishMenuId = Number(
        $(event.target).parent().find(".item-name").attr("id")
      );
      console.log(dishMenuId);
      let dishItem = {
        name: dishName,
        price: dishPrice,
        amount: dishAmount,
        menuId: dishMenuId,
      };
      cart.push(dishItem);
      $(".bookingList").append(
        `<tr class="dish text-center"><td>${dishName}</td><td>${dishAmount}</td><td>HKD ${dishPrice}</td><td><i class="fas fa-trash-alt bookingDelete"></i>
          </td></tr>`
      );
    }
  } else {
    bookingCart[requestId] = { item: [], specialRequest: "", discount: {} };
    let cart = bookingCart[requestId].item;
    dishAmount = 1;
    dishPrice = Number(
      $(event.target).parent().find(".item-price").html().replace("HKD ", "")
    );
    console.log(dishPrice);
    dishMenuId = Number($(event.target).parent().find(".item-name").attr("id"));
    let dishItem = {
      name: dishName,
      price: dishPrice,
      amount: dishAmount,
      menuId: dishMenuId,
    };
    cart.push(dishItem);
    $(".bookingList").append(
      `<tr class="dish text-center"><td>${dishName}</td><td>${dishAmount}</td><td>HKD ${dishPrice}</td><td><i class="fas fa-trash-alt bookingDelete"></i>
        </td></tr>`
    );
  }
  console.log(dishPrice);
  let price = bookingCart[requestId].item
    .map((i) => i.price * i.amount)
    .reduce((a, b) => a + b);
  $(".totalPrice").html(`HKD ${price}`);
  localStorage.setItem("bookingCart", JSON.stringify(bookingCart));
});

//BookingSubmit
$("#userBookingForm").submit(function (event) {

  $(".bookingCart").val(JSON.stringify(bookingCart[requestId]));
  
    return true;
  
});

//Review
$(".reviewButton").on("click", function (event) {
  let restId;
  if (
    window.location.pathname.includes("/order/") ||
    window.location.pathname.includes("/booking/")
  ) {
    restId = window.location.pathname.replace(/[^\d]/g, "");
  } else {
    restId = $(event.target).attr("id");
  }
  console.log(restId);
  $(".review").attr("id", restId);
});
$(".review").on("click", function (event) {
  let restId = $(event.target).attr("id");
  console.log(restId);
  let ratingVal = $("#rating").val();
  $(".review").removeAttr("id");
  $.ajax({
    type: "POST",
    url: "/review/" + restId,
    data: { rating: Number(ratingVal) },
    dataType: "json",
    success: function (response) {
    },
  });
  location.reload()
});

//Delete booking item
$(document).on("click", ".bookingDelete", function (e) {
  let target = $(e.currentTarget).parent().parent().find("td");
  let targetName = target.eq(0).html();
  console.log(targetName);
  let bookingItem = bookingCart[requestId].item.map((item) => item.name);
  let deleteIndex = bookingItem.indexOf(targetName);
  if (bookingCart[requestId].item[deleteIndex].amount === 1) {
    bookingCart[requestId].item.splice(deleteIndex, 1);
    target.remove();
  } else {
    bookingCart[requestId].item[deleteIndex].amount--;
    target.eq(1).html(bookingCart[requestId].item[deleteIndex].amount);
  }
  let price;
  if (bookingCart[requestId].item.length != 0) {
    price = bookingCart[requestId].item
      .map((i) => i.price * i.amount)
      .reduce((a, b) => a + b);
  } else {
    price = 0;
  }
  $(".totalPrice").html(`HKD ${price}`);
  localStorage.setItem("bookingCart", JSON.stringify(bookingCart));
});

//Delete shoppingItem
$(document).on("click", ".orderDelete", function (e) {
  e.preventDefault();
  let target = $(e.currentTarget).parent().parent().find("td");
  let targetName = target.eq(0).html();
  console.log(targetName);
  let orderItem = shoppingCart[requestId].item.map((item) => item.name);
  let deleteIndex = orderItem.indexOf(targetName);
  if (shoppingCart[requestId].item[deleteIndex].amount === 1) {
    shoppingCart[requestId].item.splice(deleteIndex, 1);
    target.remove();
  } else {
    shoppingCart[requestId].item[deleteIndex].amount--;
    target.eq(1).html(shoppingCart[requestId].item[deleteIndex].amount);
  }
  let price;
  if (shoppingCart[requestId].item.length != 0) {
    price = shoppingCart[requestId].item
      .map((i) => i.price * i.amount)
      .reduce((a, b) => a + b);
    if (Object.keys(shoppingCart[requestId].discount).length > 0) {
      price = Number(
        (price * (1 - shoppingCart[requestId].discount.percent_off)).toFixed(1)
      );
    }
  } else {
    price = 0;
  }
  $(".totalPrice").html(`HKD ${price}`);
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
});

$(document).on("click", ".couponDelete", function (e) {
  e.preventDefault();
  shoppingCart[requestId].discount = {};
  $(".discountList").html("");
  $("#discountCode").removeAttr("disabled");
  $(".couponCheck").removeClass("disabled");
  let price;
  if (shoppingCart[requestId].item.length != 0) {
    price = shoppingCart[requestId].item
      .map((i) => i.price * i.amount)
      .reduce((a, b) => a + b);
    if (Object.keys(shoppingCart[requestId].discount).length > 0) {
      price = Number(
        (price * (1 - shoppingCart[requestId].discount.percent_off)).toFixed(1)
      );
    }
  } else {
    price = 0;
  }

  $(".totalPrice").html(`HKD ${price}`);

  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
});
//check bookingDate
