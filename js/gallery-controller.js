'use strict'

function renderGallery() {
  const elGallery = document.querySelector('.gallery')
  const strHTMLs = gImgs.map(img => `
    <img src="${img.url}" class="gallery-img" onclick="onImgSelect(${img.id})">
  `)
  elGallery.innerHTML = strHTMLs.join('')
}

function onImgSelect(imgId) {
  gMeme.selectedImgId = imgId
  renderMeme()
}


