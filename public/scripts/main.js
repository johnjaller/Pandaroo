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