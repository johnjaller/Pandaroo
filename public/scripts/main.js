// For preview photo
function readURL(input) {
  if (input.files && input.files[0]) {
    let reader = new FileReader();

    reader.onload = function (e) {
      $("#photo").attr("src", e.target.result).width(200).height(200);
    };
    reader.readAsDataURL(input.files[0]);
  }
}


// $(document).on('click',".userInfoSubmit",()=>{
//   let username=$('.username').val()
//   let firstname=$('.firstname').val()
//   let surname=$('.surname').val()
//   let address=$('.address').val()
//   let district=$('.district').val()
//   $.ajax({
//     type: "PUT",
//     url: "/user/info",
//     data: {'username':username,'firstname':firstname,'surname':surname,'address':address,'district':district},
//     dataType: "json",
//     success: function (response) {
      
//     }
//   });
// })
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
