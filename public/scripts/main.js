import { checkUserInputs } from "./dataValidation.js";

// User info submit
$(document).on("click", ".userInfoSubmit", (event) => {
  event.preventDefault();
  $("*").removeClass("success");
  $("*").removeClass("error");

  // Converting phone data from string into number
  let phoneData = parseInt($("input[name=phone]").val());
  console.log("userSetUp.js phoneData: ", phoneData);

  let userInfo = {
    username: $("input[name=username]").val().trim(),
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
      type: "PUT",
      url: "/user/info",
      data: {
        username: userInfo.username,
        firstname: userInfo.fname,
        surname: userInfo.lname,
        address: userInfo.address,
        district: userInfo.district,
        phone: userInfo.phone,
      },
      dataType: "json",
    });

    $("#btnCloseModal").click();
    $(".userUsername").find("span").html(userInfo.username);
    $(".userFirstname").find("span").html(userInfo.firstname);
    $(".userSurname").find("span").html(userInfo.surname);
    $(".userAddress").find("span").html(userInfo.address);
    $(".userDistrict").find("span").html(userInfo.district);
    $(".userPhone").find("span").html(userInfo.phone);
  }
});
