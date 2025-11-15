'use strict'

function renderGallery() {
    var elGallery = document.querySelector('.gallery-grid')
    var strHTMLs = gImgs.map(function (img) {
        return '<img src="' + img.url + '" class="gallery-img" onclick="onImgSelect(' + img.id + ')">'
    })
    elGallery.innerHTML = strHTMLs.join('')
}

function onImgSelect(imgId) {
    setImg(imgId)
    showEditor()
    renderMeme()
    updateEditorInputs()
    updateSaveCopyVisibility()
}


function showEditor() {
    document.querySelector('.gallery').classList.add('hidden')
    document.querySelector('.saved-memes').classList.add('hidden')
    document.querySelector('.editor').classList.remove('hidden')
}

function onBackToGallery() {
    document.querySelector('.editor').classList.add('hidden')
    document.querySelector('.saved-memes').classList.add('hidden')
    document.querySelector('.gallery').classList.remove('hidden')
}
