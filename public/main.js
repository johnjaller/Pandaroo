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


