'use strict'

function renderGallery() {
    var elGallery = document.querySelector('.gallery-grid')
    var strHTMLs = gImgs.map(function (img) {
        return '<img src="' + img.url + '" class="gallery-img" onclick="onImgSelect(' + img.id + ')">'
    })
    elGallery.innerHTML = strHTMLs.join('')
}

function renderFilteredGallery(imgs) {
    var elGallery = document.querySelector('.gallery-grid')

    if (!imgs.length) {
        elGallery.innerHTML = '<p>No images match your search.</p>'
        return
    }

    var strHTMLs = imgs.map(function (img) {
        return `<img src="${img.url}" class="gallery-img" onclick="onImgSelect(${img.id})">`
    })

    elGallery.innerHTML = strHTMLs.join('')
}

function onSearch(ev) {
    var txt = ev.target.value.toLowerCase().trim()
    if (!txt) {
        renderGallery()
        return
    }

    var filtered = gImgs.filter(function (img) {
        return img.keywords.some(keyword =>
            keyword.toLowerCase().includes(txt)
        )
    })

    renderFilteredGallery(filtered)
}

function renderFilteredGallery(imgs) {
    var elGallery = document.querySelector('.gallery-grid')
    if (!imgs.length) {
        elGallery.innerHTML = '<p>No images match your search.</p>'
        return
    }

    var html = imgs.map(function (img) {
        return `<img src="${img.url}" class="gallery-img" onclick="onImgSelect(${img.id})">`
    }).join('')

    elGallery.innerHTML = html
}


function onImgSelect(imgId) {
    clearAllSearchInputs()
    setImg(imgId)
    showEditor()
    applyEditorDefaults()
    renderMeme()
    updateEditorInputs()
    updateSaveCopyVisibility()
    renderTags()
}



function showEditor() {
    document.querySelector('.gallery').classList.add('hidden')
    document.querySelector('.saved-memes').classList.add('hidden')
    document.querySelector('.editor').classList.remove('hidden')
}

function onBackToGallery() {
    clearAllSearchInputs()
    document.querySelector('.editor').classList.add('hidden')
    document.querySelector('.saved-memes').classList.add('hidden')
    document.querySelector('.gallery').classList.remove('hidden')
    resetMemeToDefault()
    renderGallery()
}



