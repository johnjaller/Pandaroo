// Shopping cart


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


$(".userLogout").on("click", function () {
  localStorage.clear();
});

$(".bookmark").on("click", (event) => {
  let restId = $(event.target).parent().attr("id");
  let icon = $(event.target);
  icon.toggleClass("far fas");
  console.log(restId);
  $.ajax({
    type: "post",
    url: `/bookmark/${restId}`,
    success: function (response) {
      console.log(response);
    },
  });
});
