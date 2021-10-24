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
