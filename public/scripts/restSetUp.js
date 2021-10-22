// Restaurant setup PUT req
$("#restSetUpSubmit").click(async (event) => {
  event.preventDefault();
  $(".invalid-feedback").hide();
  $(".valid-feedback").hide();
  $("*").removeClass("success");
  $("*").removeClass("error");

  checkInputs();

  // $.ajax({
  //   url: "/biz/bizsetup",
  //   type: "PUT",
  //   data: restInfo,
  //   success: function () {
  //     window.location.replace("https://localhost:8080/biz/info");
  //   },
  // });
});

function checkInputs() {
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

  // Validate the data
  console.log("restSetUp.js restName: ", restInfo.restName);
  if (restInfo.restName === "") {
    setMessage($("#restName"), "Restaurant name must not be blank");
    $("#restName").addClass("error");
  } else {
    setMessage($("#restName"), "OK!");
    $("#restName").addClass("success");
  }

  if (/^\d{8}$/.test(restInfo.restPhone) === false) {
    setMessage($("#restPhone"), "Phone number must be 8-digit integer");
    $("#restPhone").addClass("error");
  } else {
    setMessage($("#restPhone"), "OK!");
    $("#restPhone").addClass("success");
  }

  if (restInfo.restDistrict === "") {
    setMessage($("#restDistrict"), "District must not be blank");
    $("#restDistrict").addClass("error");
  } else {
    setMessage($("#restDistrict"), "OK!");
    $("#restDistrict").addClass("success");
  }

  if (restInfo.restAddress === "") {
    setMessage($("#restAddress"), "Address must not be blank");
    $("#restAddress").addClass("error");
  } else {
    setMessage($("#restAddress"), "OK!");
    $("#restAddress").addClass("success");
  }

  if (restInfo.restOpening === "") {
    setMessage($("#restOpening"), "Opening time must not be blank");
    $("#restOpening").addClass("error");
  } else {
    setMessage($("#restOpening"), "OK!");
    $("#restOpening").addClass("success");
  }

  if (restInfo.restClosing === "") {
    setMessage($("#restClosing"), "Closing time must not be blank");
    $("#restClosing").addClass("error");
  } else {
    setMessage($("#restClosing"), "OK!");
    $("#restClosing").addClass("success");
  }

  if (restInfo.restSeat === "") {
    setMessage($("#restSeat"), "No. of seats must not be blank");
    $("#restSeat").addClass("error");
  } else {
    setMessage($("#restSeat"), "OK!");
    $("#restSeat").addClass("success");
  }

  if (restInfo.restDelivery === "") {
    setMessage($("#restDelivery"), "Delivery service must not be blank");
    $("#restDelivery").addClass("error");
  } else {
    setMessage($("#restDelivery"), "OK!");
    $("#restDelivery").addClass("success");
  }

  if (restInfo.restDiscountCode !== "") {
    if (restInfo.restDiscount === "") {
      setMessage($("#restDiscountCode"), "OK!");
      setMessage(
        $("#restDiscount"),
        "Please set a discount for your discount code"
      );
      $("#restDiscountCode").addClass("success");
      $("#restDiscount").addClass("error");
    } else {
      if (restInfo.restDiscount !== "") {
        setMessage(
          $("#restDiscountCode"),
          "Please set a discount code for your discount"
        );
        setMessage($("#restDiscount"), "OK!");
        $("#restDiscountCode").addClass("error");
        $("#restDiscount").addClass("success");
      } else {
        setMessage($("#restDiscountCode"), "OK!");
        setMessage($("#restDelivery"), "OK!");
        $("#restDiscountCode").addClass("success");
        $("#restDiscount").addClass("success");
      }
    }
  }
}

function setMessage(input, message) {
  if (message === "OK!") {
    $(".v-msg").css("color", "#06bb06");
  } else {
    $(".v-msg").css("color", "#e45151");
  }
  input.siblings(".v-msg").html(message);
  console.log("Input: ", input, "Message: ", message);
}
