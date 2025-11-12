'use strict'

function renderGallery() {
    const elGallery = document.querySelector('.gallery')
    const strHTMLs = gImgs.map(img => `
    <img src="${img.url}" class="gallery-img" onclick="onImgSelect(${img.id})">
  `)
    elGallery.innerHTML = strHTMLs.join('')
}

function onImgSelect(imgId) {
    setImg(imgId)
    showEditor()
    renderMeme()
}

function showEditor() {
    document.querySelector('.gallery').style.display = 'none'
    document.querySelector('.editor').style.display = 'block'
}


function onBackToGallery() {
    document.querySelector('.editor').style.display = 'none'
    document.querySelector('.gallery').style.display = 'flex'
}


