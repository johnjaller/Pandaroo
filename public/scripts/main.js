// User signup password validation
$("#user-signup-form").submit((event) => {
  let usernameInput = $(event.target).find("input[name=username]").val();
  let passwordInput = $(event.target).find("input[name=password]").val();
  console.log(`USERNAME: ${usernameInput}, PASSWORD: ${passwordInput}`);
  if (!/^\w{3,20}$/.test(passwordInput)) {
    console.log("Password length must be 3-20");
    $("#validation-msg").empty();
    $("#validation-msg").append("Password length must be between 3-20!");
    return false;
  } else {
    console.log("Password validated");
  }
});

// Restaurant signup username & password validation
$("#rest-signup-form").submit((event) => {
  let usernameInput = $(event.target).find("input[name=username]").val();
  let passwordInput = $(event.target).find("input[name=password]").val();
  console.log(`USERNAME: ${usernameInput}, PASSWORD: ${passwordInput}`);
  if (/[^a-zA-Z0-9]/.test(usernameInput)) {
    console.log("Username cannot include special character");
    $("#validation-msg").empty();
    $("#validation-msg").append("Username cannot include special character!");
    return false;
  } else {
    console.log("Username validated");
  }
  if (!/^\w{3,20}$/.test(passwordInput)) {
    console.log("Password length must be 3-20");
    $("#validation-msg").empty();
    $("#validation-msg").append("Password length must be between 3-20!");
    return false;
  } else {
    console.log("Password validated");
  }
});

// Restaurant login username validation
$("#rest-login-form").submit((event) => {
  let usernameInput = $(event.target).find("input[name=username]").val();
  console.log(`USERNAME: ${usernameInput}`);
  if (!/[A-Za-z0-9]/.test(usernameInput)) {
    console.log("Username cannot include special character");
    $("#validation-msg").empty();
    $("#validation-msg").append("Username cannot include special character!");
    return false;
  } else {
    console.log("Username validated");
  }
});

// User setup POST req
$("#userSetUpForm").submit((event) => {
  event.preventDefault();
  let fnameInput = $("input[name=fname]").val();
  let lnameInput = $("input[name=lname]").val();
  let phoneInput = $("input[name=phone]").val();
  let districtInput = $("#userDistrict option:selected").text();
  let addressInput = $("input[name=address]").val();
  console.log(
    `FirstName: ${fnameInput}, LastName: ${lnameInput}, Phone: ${phoneInput}, District: ${districtInput}, Address: ${addressInput}`
  );
  $.ajax({
    url: "/setup",
    type: "PUT",
    data: {
      fname: fnameInput,
      lname: lnameInput,
      phone: phoneInput,
      district: districtInput,
      address: addressInput,
    },
    success: function () {
      window.location.replace("https://localhost:8080/");
    },
  });
});

// Shopping cart
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

let shoppingCart = {};
let requestId;
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

  console.log(requestId)
  if(shoppingCart.hasOwnProperty(requestId))
  {
    console.log(shoppingCart[requestId])
    shoppingCart[requestId].item.forEach(item=>{
      $('.orderList').append(`<tr class="dish text-center"><td>${item.name}</td><td>${item.amount}</td><td>HKD ${item.price}</td></tr>`)
    })
      let price
      if(Object.keys(shoppingCart[requestId].discount).length>0)
      {
        let coupon= shoppingCart[requestId].discount
        let discount=coupon.percent_off*100
  $('.discountList').append(`<tr class="dish text-center"><td>Discount: '${coupon.discountCode}'</td><td></td><td>-${discount}%</td></tr>`)
  $('#discountCode').prop('disabled','disabled')
  $('.couponCheck').addClass('disabled')
  price=Number((price*(1-shoppingCart[requestId].discount.percent_off)).toFixed(1))
}else{
  price=shoppingCart[requestId].item.map(i=>i.price*i.amount).reduce((a,b)=>a+b)
}
      $('.totalPrice').html(`HKD ${price}`)
}
    
    else {
    return false;
  }

}else if(window.location.pathname.includes('/success/'))
{
  let deleteId=window.location.pathname.replace(/[^\d]/g,'')
  delete shoppingCart[deleteId]
localStorage.setItem('shoppingCart',JSON.stringify(shoppingCart))
}
else{
  return false;
}
});

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
        `<td>${dishName}</td><td>${dishAmount}</td><td>HKD ${dishPrice}</td>`
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
        `<tr class="dish text-center"><td>${dishName}</td><td>${dishAmount}</td><td>HKD ${dishPrice}</td></tr>`
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
      `<tr class="dish text-center"><td>${dishName}</td><td>${dishAmount}</td><td>HKD ${dishPrice}</td></tr>`
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
$('#userOrderForm').submit(function () { 
  let request=$('.specialRequest').val()
  shoppingCart[requestId]['specialRequest']=request
  localStorage.setItem('shoppingCart',JSON.stringify(shoppingCart))
  order=[]
  console.log('running checkout')
  
  shoppingCart[requestId].item.forEach(dish=>order.push({
    price_data: {
      currency: 'hkd',
      product_data: {
        name: dish.name,
        metadata:{menu_id:dish.menuId},
      },
      unit_amount: dish.price*100,
    },
    quantity: dish.amount,
  }))
  $('.userRest').val(requestId)
  console.log(  $('.userRest').val())
  $('.userOrder').val(JSON.stringify(order))
  if(Object.keys(shoppingCart[requestId].discount).length>0)
  {
  let discount=shoppingCart[requestId].discount.percent_off*100
  $('#discount').val(JSON.stringify({name:shoppingCart[requestId].discount.discountCode,percent_off:discount}))
  }else{
    $('#discount').val(JSON.stringify({}))
  }
  return true
});

$(".couponCheck").on("click", function (event) {
  let couponCode = $("#discountCode").val();
  $("#discountCode").val("");
  console.log(couponCode);
  $.ajax({
    type: "post",
    url: "/discount",
    data: { code: couponCode },
    dataType: "json",
    success: function (response) {
      console.log(response)
      if(response.percent_off===null)
      {
        return alert(`There is no such coupon for "${couponCode}"`)
      }else{
  $('#discountCode').prop('disabled','disabled')
  $(event.target).addClass('disabled')
        let discount=response.percent_off*100
        shoppingCart[requestId].discount=response
        $('.discountList').append(`<tr class="dish text-center"><td>Discount: '${couponCode}'</td><td></td><td>-${discount}%</td></tr>`)
let price=shoppingCart[requestId].item.map(i=>i.price*i.amount).reduce((a,b)=>a+b)
price=Number((price*(1-shoppingCart[requestId].discount.percent_off)).toFixed(1))

        $(".totalPrice").html(`HKD ${price}`);

        localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
      }
    },
  });
});
$(".userLogout").on("click", function () {
  localStorage.clear();
});

$('.bookmark').on('click',(event)=>{
  let restId=$(event.target).parent().attr('id')
  let icon=$(event.target)
  if(icon.hasClass('far'))
  {
  icon.toggleClass('far fas')
  console.log(restId)
  $.ajax({
    type: "post",
    url: `/bookmark/${restId}`,
    success: function (response) {
      console.log(response)
      
    }
  });
}else{
  icon.toggleClass('fas far')
  console.log(restId)
  $.ajax({
    type: "delete",
    url: `/bookmark/${restId}`,
    success: function (response) {
      console.log(response)
      
    }
  });
}
})
// // User login Ajax POST req
// $("#user-login-form").submit((event) => {
//   event.preventDefault();
//   let usernameInput = $("input[type=email]").val();
//   let passwordInput = $("input[type=password]").val();
//   console.log(`USERNAME: ${usernameInput}, PASSWORD: ${passwordInput}`);
//   $.post({
//     url: "/login",
//     data: { username: usernameInput, password: passwordInput },
//   }).done(() => {
//     console.log("Successfully sent POST request");
//   });
// });

// User signup Ajax POST req
// $("#user-signup-form").submit((event) => {
//   event.preventDefault();
//   let fnameInput = $(event.target).find("input[name=fname]").val();
//   let lnameInput = $(event.target).find("input[name=lname]").val();
//   let phoneInput = $(event.target).find("input[name=phone]").val();
//   let usernameInput = $(event.target).find("input[name=username]").val();
//   let passwordInput = $(event.target).find("input[name=password]").val();
//   console.log(
//     `FNAME: ${fnameInput}, LNAME: ${lnameInput}, PHONE: ${phoneInput}, USERNAME: ${usernameInput}, PASSWORD: ${passwordInput}`
//   );
//   $.post({
//     url: "/signup",
//     data: {
//       username: usernameInput,
//       firstname: fnameInput,
//       surname: lnameInput,
//       password: passwordInput,
//       phone_no: phoneInput,
//     },
//   }).done(() => {
//     console.log("Successfully sent POST request");
//   });
// });

// Rest login Ajax POST req
// $("#rest-login-form").submit((event) => {
//   event.preventDefault();
//   let usernameInput = $("input[name=username]").val();
//   if (usernameInput.includes("@")) {
//     console.log("Username cannot includes @");
//     return;
//   }
//   let passwordInput = $("input[name=password]").val();
//   console.log(`USERNAME: ${usernameInput}, PASSWORD: ${passwordInput}`);
//   $.post({
//     url: "/bizlogin",
//     data: {
//       username: usernameInput,
//       password: passwordInput,
//     },
//   }).done(() => {
//     console.log("Successfully sent POST request");
//   });
// });
