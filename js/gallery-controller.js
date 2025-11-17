'use strict'

var gSelectedTags = []

function renderGallery() {
    var elGallery = document.querySelector('.gallery-grid')
    var strHTMLs = gImgs.map(img =>
        `<img src="${img.url}" class="gallery-img" onclick="onImgSelect(${img.id})">`
    )
    elGallery.innerHTML = strHTMLs.join('')
}

function renderFilteredGallery(imgs) {
    var elGallery = document.querySelector('.gallery-grid')
    if (!imgs.length) {
        elGallery.innerHTML = '<p>No images match your search.</p>'
        return
    }
    var html = imgs.map(img =>
        `<img src="${img.url}" class="gallery-img" onclick="onImgSelect(${img.id})">`
    ).join('')
    elGallery.innerHTML = html
}

function onImgSelect(imgId) {
    gLastScreen = 'gallery'
    document.querySelector('.btn-back.inline').textContent = 'Back to Gallery'
    clearAllSearchInputs()
    setImg(imgId)
    gMeme.savedIdx = -1
    resetMemeToDefault()
    showEditor()
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
    if (gSelectedTags.length) {
        renderSelectedTags()
        filterByTags(gSelectedTags)
    } else {
        renderGallery()
    }
}

function onEditorBack() {
    clearAllSearchInputs()

    if (gLastScreen === 'saved') {
        document.querySelector('.editor').classList.add('hidden')
        document.querySelector('.gallery').classList.add('hidden')
        document.querySelector('.saved-memes').classList.remove('hidden')

        var input = document.querySelector('.saved-tag-search-input')
        if (input) input.value = ''

        var drop = document.querySelector('.saved-tag-dropdown')
        if (drop) drop.classList.add('hidden')

        renderSavedMemes()

    } else {
        document.querySelector('.editor').classList.add('hidden')
        document.querySelector('.saved-memes').classList.add('hidden')
        document.querySelector('.gallery').classList.remove('hidden')
        if (gSelectedTags.length) {
            renderSelectedTags()
            filterByTags(gSelectedTags)
        } else {
            renderGallery()
        }
    }
}

function onToggleTagDropdown() {
    var box = document.querySelector('.tag-dropdown')
    var inputVal = document.querySelector('.tag-search-input').value || ''

    if (box.classList.contains('hidden')) {
        onFilterTagOptions(inputVal)
        box.classList.remove('hidden')
    } else {
        box.classList.add('hidden')
    }
}

function renderTagOptions() {
    var elList = document.querySelector('.tag-options')
    var tags = Object.keys(gKeywordSearchCountMap)
    elList.innerHTML = tags.map(tag =>
        `<li onclick="onSelectTag('${tag}')">${tag}</li>`
    ).join('')
}

function onFilterTagOptions(txt) {
    var box = document.querySelector('.tag-dropdown')
    var elList = document.querySelector('.tag-options')
    if (!box || !elList) return

    box.classList.remove('hidden')

    txt = txt.toLowerCase().trim()

    var possibleTags = getAvailableTags()

    var finalTags = possibleTags.filter(tag => !gSelectedTags.includes(tag))

    if (txt) {
        finalTags = finalTags.filter(tag =>
            tag.toLowerCase().includes(txt)
        )
    }

    elList.innerHTML = finalTags.map(tag =>
        `<li onclick="onSelectTag('${tag}')">${tag}</li>`
    ).join('')
}

function onLiveTagSearch(txt) {
    txt = txt.toLowerCase().trim();

    onFilterTagOptions(txt);

    if (!txt) {
        if (gSelectedTags.length) {
            filterByTags(gSelectedTags);
        } else {
            renderGallery();
        }
        return;
    }

    var baseImgs = gImgs;
    if (gSelectedTags.length) {
        baseImgs = gImgs.filter(img =>
            gSelectedTags.every(tag => img.keywords.includes(tag))
        );
    }

    var filtered = baseImgs.filter(img =>
        img.keywords.some(keyword =>
            keyword.toLowerCase().includes(txt)
        )
    );

    renderFilteredGallery(filtered);
}

function onSelectTag(tag) {
    if (!gSelectedTags.includes(tag)) {
        gSelectedTags.push(tag)
    }

    renderSelectedTags()
    filterByTags(gSelectedTags)

    document.querySelector('.tag-dropdown').classList.add('hidden')
    document.querySelector('.tag-search-input').value = ''
}


function renderSelectedTags() {
    var el = document.querySelector('.selected-tags')
    el.innerHTML = gSelectedTags.map(tag =>
        `<div class="selected-tag">${tag}<button onclick="onRemoveSelectedTag('${tag}')">✕</button></div>`
    ).join('')
}

function onRemoveSelectedTag(tag) {
    gSelectedTags = gSelectedTags.filter(t => t !== tag)
    renderSelectedTags()
    filterByTags(gSelectedTags)
}

function filterByTags(tags) {
    if (!tags.length) {
        renderGallery()
        return
    }
    var filtered = gImgs.filter(img =>
        tags.every(tag => img.keywords.includes(tag))
    )
    renderFilteredGallery(filtered)
}

window.addEventListener('click', function (ev) {
    var searchBox = document.querySelector('.tag-search')
    var drop = document.querySelector('.tag-dropdown')
    if (!drop || !searchBox) return
    if (!searchBox.contains(ev.target)) drop.classList.add('hidden')
})

function getAvailableTags() {
    var imgs = gImgs

    if (gSelectedTags.length) {
        imgs = imgs.filter(img =>
            gSelectedTags.every(tag => img.keywords.includes(tag))
        )
    }

    var set = new Set()
    imgs.forEach(img => img.keywords.forEach(t => set.add(t)))

    return Array.from(set)
}
