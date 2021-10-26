// User setup checking
export function checkUserInputs(userInfo) {
  if (userInfo.fname === "") {
    setMessage($("#userFirstName"), "First name must not be blank");
    $("#userFirstName").addClass("error");
  } else {
    setMessage($("#userFirstName"), "OK!");
    $("#userFirstName").addClass("success");
  }

  if (userInfo.lname === "") {
    setMessage($("#userLastName"), "Last name must not be blank");
    $("#userLastName").addClass("error");
  } else {
    setMessage($("#userLastName"), "OK!");
    $("#userLastName").addClass("success");
  }

  if (/^\d{8}$/.test(userInfo.phone) === false) {
    setMessage($("#userPhone"), "Phone number must be 8-digit integer");
    $("#userPhone").addClass("error");
  } else {
    setMessage($("#userPhone"), "OK!");
    $("#userPhone").addClass("success");
  }

  if (userInfo.district === "") {
    setMessage($("#userDistrict"), "District must not be blank");
    $("#userDistrict").addClass("error");
  } else {
    setMessage($("#userDistrict"), "OK!");
    $("#userDistrict").addClass("success");
  }

  if (userInfo.address === "") {
    setMessage($("#userAddress"), "Address must not be blank");
    $("#userAddress").addClass("error");
  } else {
    setMessage($("#userAddress"), "OK!");
    $("#userAddress").addClass("success");
  }
}

// Restaurant setup checking
export function checkRestInputs(restInfo) {
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

  if (
    restInfo.restOpening !== "" &&
    restInfo.restClosing !== "" &&
    restInfo.restOpening.substring(0, 5) ===
      restInfo.restClosing.substring(0, 5)
  ) {
    setMessage(
      $("#restOpening"),
      "Opening time and closing time must not be the same"
    );
    $("#restOpening").addClass("error");
    setMessage(
      $("#restClosing"),
      "Opening time and closing time must not be the same"
    );
    $("#restClosing").addClass("error");
  } else if (
    restInfo.restOpening !== "" &&
    restInfo.restClosing !== "" &&
    restInfo.restOpening.substring(0, 5) !==
      restInfo.restClosing.substring(0, 5)
  ) {
    setMessage($("#restOpening"), "OK!");
    $("#restOpening").addClass("success");
    setMessage($("#restClosing"), "OK!");
    $("#restClosing").addClass("success");
  }

  if (restInfo.restOpening === "") {
    setMessage($("#restOpening"), "Opening time must not be blank");
    $("#restOpening").addClass("error");
  }

  if (restInfo.restClosing === "") {
    setMessage($("#restClosing"), "Closing time must not be blank");
    $("#restClosing").addClass("error");
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
    // Case: restDiscountCode is not empty
    if (isNaN(restInfo.restDiscount)) {
      setMessage($("#restDiscountCode"), "OK!");
      setMessage(
        $("#restDiscount"),
        "Please set a discount for your discount code"
      );
      $("#restDiscountCode").addClass("success");
      $("#restDiscount").addClass("error");
    } else {
      setMessage($("#restDiscountCode"), "OK!");
      setMessage($("#restDiscount"), "OK!");
      $("#restDiscountCode").addClass("success");
      $("#restDiscount").addClass("success");
    }
  } else {
    // Case: restDiscountCode is empty
    if (isNaN(restInfo.restDiscount)) {
      setMessage($("#restDiscountCode"), "OK!");
      setMessage($("#restDiscount"), "OK!");
      $("#restDiscountCode").addClass("success");
      $("#restDiscount").addClass("success");
    } else {
      setMessage($("#restDiscountCode"), "Please set a code for your discount");
      setMessage($("#restDiscount"), "OK!");
      $("#restDiscountCode").addClass("error");
      $("#restDiscount").addClass("success");
    }
  }

  if (restInfo.restAbout === "") {
    setMessage($("#floatingTextarea2"), "Introduction must not be blank");
    $("#floatingTextarea2").addClass("error");
  } else {
    setMessage($("#floatingTextarea2"), "OK!");
    $("#floatingTextarea2").addClass("success");
  }

  if (restInfo.restTag.length < 1) {
    setMessage($("#restTag"), "Please select at least one tag");
    $("#restTag").addClass("error");
  } else {
    setMessage($("#restTag"), "OK!");
    $("#restTag").addClass("success");
  }
}

export function setMessage(input, message) {
  if (message === "OK!") {
    input.siblings(".v-msg").css("color", "#06bb06");
  } else {
    input.siblings(".v-msg").css("color", "#e45151");
  }
  input.siblings(".v-msg").html(message);
  // console.log("Input: ", input, "Message: ", message);
}
