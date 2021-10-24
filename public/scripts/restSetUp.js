import { checkRestInputs } from "./dataValidation.js";

// "Auto-check" tag-checkbox
$(() => {
  $.get({
    url: "/biz/biztag",
    success: function (data) {
      if (data.data) {
        console.log("Data: ", data.data);
        data.data.forEach((tag) => {
          console.log(tag.tag_name);
          $(`#${tag.tag_name}`).prop("checked", true);
        });
      } else {
        console.log("No data");
      }
    },
  });
});

// Restaurant setup PUT req
$("#restSetUpSubmit").click((event) => {
  event.preventDefault();
  $("*").removeClass("success");
  $("*").removeClass("error");

  // Converting phone data from string into number
  let phoneData = parseInt($("#restPhone").val());
  console.log("restSetUp.js phoneData: ", phoneData);
  // Converting delivery data from string to boolean
  let deliveryData = true;
  if ($("#restDelivery option:selected").val() === "False") {
    deliveryData = false;
  }
  // Converting discount data from string to decimal
  let discountData = (100 - parseInt($("#restDiscount").val())) / 100;
  console.log("restSetUp.js discountData: ", discountData);
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

  checkRestInputs(restInfo);

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
