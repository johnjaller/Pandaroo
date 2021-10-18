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

// Restaurant setup PUT req
$("#restSetUpSubmit").click((event) => {
  event.preventDefault();
  // Converting phone data from string into number
  let phoneData = parseInt($("#restPhone").val());
  console.log("main.js phoneData: ", phoneData);
  // Converting delivery data from string to boolean
  let deliveryData = true;
  if ($("#restDelivery option:selected").val() === "False") {
    deliveryData = false;
  }
  // Converting discount data from string to decimal
  let discountData = parseInt($("#restDiscount").val()) / 100;
  console.log("main.js discountData: ", discountData);
  // Converting tag checkbox data to an array
  let checkboxData = [];
  $.each($(".form-check-input:checked"), function () {
    checkboxData.push($(this).val());
  });
  console.log("main.js checkboxData", checkboxData);

  // Validating phone data must be 8-digit integer
  if (/^\d{8}$/.test($("#restPhone").val())) {
    let restInfo = {
      restName: $("#restName").val(),
      restPhone: phoneData,
      restDistrict: $("#restDistrict option:selected").text(),
      restAddress: $("#restAddress").val(),
      restOpening: $("#restOpening").val(),
      restClosing: $("#restClosing").val(),
      restSeat: $("#restSeat").val(),
      restDelivery: deliveryData,
      restDiscountCode: $("#restDiscountCode").val(),
      restDiscount: discountData,
      restAbout: $("#floatingTextarea2").val(),
      restTag: checkboxData,
    };
    console.log("Rest Info: ", restInfo);

    $.ajax({
      url: "/biz/bizsetup",
      type: "PUT",
      data: restInfo,
      success: function () {
        window.location.replace("https://localhost:8080/biz/bizsetupmenu");
      },
    });
  } else {
    console.log("Incorrect phone number");
    return false;
  }
});

// $(document).on('click',".userInfoSubmit",()=>{
//   let username=$('.username').val()
//   let firstname=$('.firstname').val()
//   let surname=$('.surname').val()
//   let address=$('.address').val()
//   let district=$('.district').val()
//   $.ajax({
//     type: "PUT",
//     url: "/user/info",
//     data: {'username':username,'firstname':firstname,'surname':surname,'address':address,'district':district},
//     dataType: "json",
//     success: function (response) {

//     }
//   });
// })

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
