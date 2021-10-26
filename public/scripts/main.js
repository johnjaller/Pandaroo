// Shopping cart
$(document).ready(function () {
  if (window.location.pathname.includes("/order/")) {
    if (!localStorage.hasOwnProperty("shoppingCart")) {
      localStorage.setItem("shoppingCart", "");
      shoppingCart = {};
    } else {
      shoppingCart = JSON.parse(localStorage.getItem("shoppingCart"));
    }
    console.log(shoppingCart);
    requestId = window.location.pathname.replace(/[^\d]/g, "");

    console.log(requestId);
    if (shoppingCart.hasOwnProperty(requestId)) {
      console.log(shoppingCart[requestId]);
      shoppingCart[requestId].item.forEach((item) => {
        $(".orderList").append(
          `<tr class="dish text-center"><td>${item.name}</td><td>${item.amount}</td><td>HKD ${item.price}</td></tr>`
        );
      });
      let price;
      if (Object.keys(shoppingCart[requestId].discount).length > 0) {
        let coupon = shoppingCart[requestId].discount;
        let discount = coupon.percent_off * 100;
        $(".discountList").append(
          `<tr class="dish text-center"><td>Discount: '${coupon.discountCode}'</td><td></td><td>-${discount}%</td></tr>`
        );
        $("#discountCode").prop("disabled", "disabled");
        $(".couponCheck").addClass("disabled");
        price = Number(
          (price * (1 - shoppingCart[requestId].discount.percent_off)).toFixed(
            1
          )
        );
      } else {
        price = shoppingCart[requestId].item
          .map((i) => i.price * i.amount)
          .reduce((a, b) => a + b);
      }
      $(".totalPrice").html(`HKD ${price}`);
    } else {
      return false;
    }
  } else if (window.location.pathname.includes("/success/")) {
    let deleteId = window.location.pathname.replace(/[^\d]/g, "");
    delete shoppingCart[deleteId];
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  } else {
    return false;
  }
});

$(document).on("click", ".userInfoSubmit", () => {
  let username = $(".username").val();
  let firstname = $(".firstname").val();
  let surname = $(".surname").val();
  let address = $(".address").val();
  let district = $(".district").val();
  let phone = $(".phone").val();
  $.ajax({
    type: "PUT",
    url: "/user/info",
    data: {
      username: username,
      firstname: firstname,
      surname: surname,
      address: address,
      district: district,
      phone: phone,
    },
    dataType: "json",
  });
  $(".userUsername").find("span").html(username);
  $(".userFirstname").find("span").html(firstname);
  $(".userSurname").find("span").html(surname);
  $(".userAddress").find("span").html(address);
  $(".userDistrict").find("span").html(district);
  $(".userPhone").find("span").html(phone);
});

$(".userLogout").on("click", function () {
  localStorage.clear();
});

$(".bookmark").on("click", (event) => {
  let restId = $(event.target).parent().attr("id");
  let icon = $(event.target);
  icon.toggleClass("far fas");
  console.log(restId);
  $.ajax({
    type: "post",
    url: `/bookmark/${restId}`,
    success: function (response) {
      console.log(response);
    },
  });
});
