//upload img
var loadingStart = function (element) {
    $(element).append(`<div class="overlay"><i class="fas fa-spinner fa-2x fa-spin"></i></div>`)
  }
  
  var loadingStop = function (element) {
    $(element).find('.overlay').remove()
  }

function uploadImage(route = false, wrap = 'body .modal-dialog', inputName = 'img', event) {
    const img = $(event)
    const imgData = img.prop('files')[0]
    const formData = new FormData()
    formData.append(inputName, imgData)
    $.ajax({
      url: route,
      type: 'POST',
      dataType: 'json',
      processData: false,
      contentType: false,
      cache: false,
      data: formData,
      beforeSend: function () {
        loadingStart(wrap)
      },
      success: async (response) => {
        loadingStop(wrap)
        const parent = img.closest('.imgWrap')
        parent.find('#note-has-image').hide()
        parent.find('.imgUrl').val(response.key)
        parent.find('.imgElement').html(`<img class="img" src="${response.path}" width="100%">`)
        parent.closest('.imgBox').find('.imgDel').remove()
        parent.closest('.imgBox').append('<span class="imgDel" onclick="delImg(this)"><i class="fas fa-times"></i></span>')
      },
      error: (error) => {
        loadingStop(wrap)
        Swal.fire({
          title: '通知',
          text: error.message,
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        })
      },
    })
  }
function delImg(img) {
    const parent = $(img).closest('.imgBox')
    parent.find('.imgElement').html('<b>Choose Img</b>')
    parent.find('.imgUrl').attr('value', '')
    $(img).remove()
  }
