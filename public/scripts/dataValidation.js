// Data validation for restaurant form
const checkPhone = (phone) => {
  if (/^\d{8}$/.test(phone)) {
    return true;
  } else {
    return { message: "Phone number must be an 8-digit integer" };
  }
};

const checkSeat = (seat) => {
  if (/^\d*$/.test(seat)) {
    return true;
  } else {
    return {
      message: "No. of seats must be an integer",
    };
  }
};

const checkTag = (tag) => {
  if (tag.length > 0) {
    return true;
  } else {
    return {
      message: "Please select at least one tag.",
    };
  }
};

// Data conversion for restaurant form
const convertDelivery = (delivery) => {
  if (delivery === "False") {
    return false;
  } else {
    return true;
  }
};

module.exports = {
  checkPhone: checkPhone,
  checkSeat: checkSeat,
  checkTag: checkTag,
  convertDelivery: convertDelivery,
};
