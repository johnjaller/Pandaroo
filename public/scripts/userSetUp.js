import { checkUserInputs } from "./dataValidation.js";

// User setup POST req
$("#userSetUpForm").submit((event) => {
  event.preventDefault();
  $("*").removeClass("success");
  $("*").removeClass("error");

  // Converting phone data from string into number
  let phoneData = parseInt($("input[name=phone]").val());
  console.log("userSetUp.js phoneData: ", phoneData);


  // Original
  let userInfo = {
    fname: $("input[name=fname]").val().trim(),
    lname: $("input[name=lname]").val().trim(),
    phone: phoneData,
    district: $("#userDistrict option:selected").text(),
    address: $("input[name=address]").val().trim(),
  };
  console.log(userInfo);

  checkUserInputs(userInfo);

  if ($(".error")[0]) {
    return;
  } else {
    $.ajax({
      url: "/user/setup",
      type: "PUT",
      data: userInfo,
      success: function () {
        alert("Successfully updated!");
        window.location.replace(process.env.domain+'/');
      },
    });
  }
});
