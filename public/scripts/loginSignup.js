// User signup password validation
$("#user-signup-form").submit((event) => {
  let usernameInput = $(event.target).find("input[name=username]").val();
  let passwordInput = $(event.target).find("input[name=password]").val();
  console.log(`USERNAME: ${usernameInput}, PASSWORD: ${passwordInput}`);

  userEmailCheck(usernameInput);

  if (!/^\w{3,20}$/.test(passwordInput)) {
    console.log("Password length must be 3-20");
    $("#validation-msg").empty();
    $("#validation-msg").append("Password length must be between 3-20!");
    return false;
  } else {
    console.log("Password validated");
  }
});

// Restaurant signup username & password validation
$("#rest-signup-form").submit((event) => {
  let usernameInput = $(event.target).find("input[name=username]").val();
  let passwordInput = $(event.target).find("input[name=password]").val();
  console.log(`USERNAME: ${usernameInput}, PASSWORD: ${passwordInput}`);
  if (/[^a-zA-Z0-9]/.test(usernameInput)) {
    console.log("Username cannot include special character");
    $("#validation-msg").empty();
    $("#validation-msg").append("Username cannot include special character!");
    return false;
  } else {
    console.log("Username validated");
  }
  if (!/^\w{3,20}$/.test(passwordInput)) {
    console.log("Password length must be 3-20");
    $("#validation-msg").empty();
    $("#validation-msg").append("Password length must be between 3-20!");
    return false;
  } else {
    console.log("Password validated");
  }
});

// Restaurant login username validation
$("#rest-login-form").submit((event) => {
  let usernameInput = $(event.target).find("input[name=username]").val();
  console.log(`USERNAME: ${usernameInput}`);
  if (!/[A-Za-z0-9]/.test(usernameInput)) {
    console.log("Username cannot include special character");
    $("#validation-msg").empty();
    $("#validation-msg").append("Username cannot include special character!");
    return false;
  } else {
    console.log("Username validated");
  }
});
