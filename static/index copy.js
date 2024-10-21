window.onload = () => {
  $("#sendbutton").click(() => {
    imagebox = $("#imagebox");
    link = $("#link");
    input = $("#imageinput")[0];
    if (input.files && input.files[0]) {
      let formData = new FormData();
      formData.append("video", input.files[0]);
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
        success: function (data) {
          console.log(data);
          // bytestring = data["status"];
          // image = bytestring.split("'")[1];
          $("#link").css("visibility", "visible");
          $("#download").attr("href", "static/" + data);
          console.log(data);
        },
      });
    }
  });
  $("#opencam").click(() => {
    console.log("evoked openCam");
    $.ajax({
      url: "/opencam",
      type: "GET",
      error: function (data) {
        console.log("upload error", data);
      },
      success: function (data) {
        console.log(data);
      }
    });
  })
};

function readUrl(input) {
  imagebox = $("#imagebox");
  videobox = $("#videobox")
  console.log(imagebox);
  console.log("evoked readUrl");
  console.log(input.files)
  if (input.files && input.files[0]) {
    type_file = input.files[0].type
    console.log(input.files[0].type)
    
    let reader = new FileReader();
    reader.onload = function (e) {
      console.log(e.target);
      if (type_file.indexOf("image/")==-1) {
        imagebox.attr("src", e.target.result);
      } else if (type_file.indexOf("video/")) {
        document.querySelector('#videobox').src = e.target.result;
      }
      // imagebox.attr("src", e.target.result);
      //   imagebox.height(500);
      //   imagebox.width(800);
    };
    reader.readAsDataURL(input.files[0]);
  }
}


// function openCam(e){
//   console.log("evoked openCam");
//   e.preventDefault();
//   console.log("evoked openCam");
//   console.log(e);
// }

// function getFileMimeType(file) {
//   const map = {
//       'FFD8FFE0': 'jpg',
//       '89504E47': 'png',
//       '47494638': 'gif',
//       "52494646": 'webp'
//   }

//   const reader = new FileReader();
//   reader.readAsArrayBuffer(file);
//   return new Promise((resolve, reject) => {
//       reader.onload = (event) => {
//         try {
//             let array = new Uint8Array(event.target.result);
//             array = array.slice(0, 4);
//             console.log(array);
//             let arr = [...array]
//             let key = arr.map(item => item.toString(16)
//                 .toUpperCase()
//                 .padStart(2, '0'))
//                 .join('')
//             resolve(map[key])

//         } catch (e) {
//             reject(e);
//         }
//       };
//   });
// }


// document.getElementById('sendbutton').onclick = function () {
//   if (f.files.length > 1) {
//       for (const file of f.files) {
//           upload(file)
//       }
//   } else {
//       upload(f.files[0])
//   }
// }

// function upload(file) {
// getFileMimeType(file).then(res => {
//   if (res) {
//       let fd = new FormData(form);
//       let xhr = new XMLHttpRequest();
//       xhr.open("post", '/detect');
//       xhr.send(fd);
//   } else {
//       alert('文件格式不符合上传要求')
//       f.value = ''
//       return
//   }

// }).catch(err => {
//     console.log(err)
// })
// }