window.onload = () => {
  $("#detectbutton").click(() => {
    imagebox = $("#imagebox");
    videobox = $("#videobox")
    link = $("#link");
    input = $("#fileInput")[0];
    if (input.files && input.files[0]) {
      let formData = new FormData();
      fileName = input.files[0].name
      if (imagebox.css('display') != 'none') {
        formData.append("image", input.files[0]);
      } else if (videobox.css('display') != 'none') {
        formData.append("video", input.files[0]);
      }
      // 载入loading图标
      $('#loading_icon').css('display', '');
      $.ajax({
        url: "/detect", // fix this to your liking
        type: "POST",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        error: function (data) {
          console.log("upload error", data);
          console.log(data.getAllResponseHeaders());
        },
        
        success: function (data, textStatus, jqXHR) {
          let contentType = jqXHR.getResponseHeader('Content-Type');
          console.log({'contentType': contentType});
          // loading图标移除
          $('#loading_icon').css('display', 'none');
          if (contentType.indexOf('image/') != -1) {
            imagebox.attr('src', '/src/' + fileName);
            $('#link').css('display', 'flex');
            $('#download').attr('href', '/src/' + fileName);
            console.log({'src': '/src/' + fileName});
          } else if (contentType.indexOf('video/') != -1) {
            // 不显示, 替换为视频的加载链接
            // videobox.css('display', 'none');
            $('#link').css('display', 'flex');
            $('#download').attr('href', '/src/' + fileName);
            console.log({'Download': '/src/' + fileName});
          }
        },
      });
    }
  });
  // $("#opencam").click(() => {
  //   console.log("evoked openCam");
  //   $.ajax({
  //     url: "/opencam",
  //     type: "GET",
  //     error: function (data) {
  //       console.log("upload error", data);
  //     },
  //     success: function (data) {
  //       console.log(data);
  //     }
  //   });
  // })
};

function BinaryToBase64(data, contentType) {
  return new Promise((resolve, reject) => {
    let blob = new Blob([data], {type: contentType})
    let reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

function readUrl(input) {
  imagebox = $("#imagebox");
  videobox = $("#videobox");
  $('#link').css('display', 'none');
  console.log(imagebox);
  console.log("evoked readUrl");
  console.log(input.files)
  if (input.files && input.files[0]) {
    type_file = input.files[0].type
    console.log(input.files[0].type)
    
    let reader = new FileReader();
    reader.onload = function (e) {
      console.log(e.target);
      if (type_file.indexOf("image/") != -1) {
        imagebox.css("display", "");
        videobox.css("display", "none");
        imagebox.attr("src", e.target.result);
      } else if (type_file.indexOf("video/") != -1) {
        imagebox.css("display", "none");
        videobox.css("display", "");
        videobox.attr("src", e.target.result);
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
}