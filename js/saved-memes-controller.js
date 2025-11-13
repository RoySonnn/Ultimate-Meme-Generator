'use strict'

function onShowSavedMemes() {
    document.querySelector('.gallery').classList.add('hidden')
    document.querySelector('.editor').classList.add('hidden')
    document.querySelector('.saved-memes').classList.remove('hidden')
    renderSavedMemes()
}

function renderSavedMemes() {
    const saved = getSavedMemes()
    const el = document.querySelector('.saved-grid')

    if (!saved.length) {
        el.innerHTML = '<p>No saved memes yet.</p>'
        return
    }

    let html = ''

    html += saved
        .map((meme, idx) => {
            const imgSrc = meme.savedImg || getImgById(meme.selectedImgId).url
            return (
                '<img src="' +
                imgSrc +
                '" class="gallery-img" onclick="onLoadSavedMeme(' +
                idx +
                ')">'
            )
        })
        .join('')

    el.innerHTML = html
}

function onLoadSavedMeme(idx) {
    var saved = getSavedMemes()
    var meme = saved[idx]
    loadMeme(meme)
    document.querySelector('.saved-memes').classList.add('hidden')
    document.querySelector('.editor').classList.remove('hidden')
    updateEditorInputs()
    renderMeme()
}
