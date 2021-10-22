import { checkInputs } from "./dataValidation.js";

// Restaurant setup PUT req
$("#restSetUpSubmit").click(async (event) => {
  event.preventDefault();
  $(".invalid-feedback").hide();
  $(".valid-feedback").hide();
  $("*").removeClass("success");
  $("*").removeClass("error");

  // Converting phone data from string into number
  let phoneData = parseInt($("#restPhone").val());
  console.log("main.js phoneData: ", phoneData);
  // Converting delivery data from string to boolean
  let deliveryData = true;
  if ($("#restDelivery option:selected").val() === "False") {
    deliveryData = false;
  }
  // Converting discount data from string to decimal
  let discountData = (100 - parseInt($("#restDiscount").val())) / 100;
  console.log("main.js discountData: ", discountData);
  // Converting tag checkbox data to an array
  let checkboxData = [];
  $.each($(".form-check-input:checked"), function () {
    checkboxData.push($(this).val());
  });
  console.log("main.js checkboxData", checkboxData);

  let restInfo = {
    restName: $("#restName").val().trim(),
    restPhone: phoneData,
    restDistrict: $("#restDistrict option:selected").text(),
    restAddress: $("#restAddress").val().trim(),
    restOpening: $("#restOpening").val(),
    restClosing: $("#restClosing").val(),
    restSeat: $("#restSeat").val(),
    restDelivery: deliveryData,
    restDiscountCode: $("#restDiscountCode").val().trim(),
    restDiscount: discountData,
    restAbout: $("#floatingTextarea2").val().trim(),
    restTag: checkboxData,
  };
  console.log("Rest Info: ", restInfo);

  await checkInputs(restInfo);

  if ($(".error")[0]) {
    return;
  } else {
    $.ajax({
      url: "/biz/bizsetup",
      type: "PUT",
      data: restInfo,
      success: function () {
        alert("Successfully updated!");
        window.location.replace("https://localhost:8080/biz/info");
      },
    });
  }
});
