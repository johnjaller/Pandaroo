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
  let discountData = (100 - parseInt($("#restDiscount").val())) / 100;
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
      // success: function () {
      //   window.location.replace("https://localhost:8080/biz/bizsetupmenu");
      // },
    }).then(() => {
      alert("Successfully updated!");
    });
  } else {
    console.log("Incorrect phone number");
    return false;
  }
});
