'use strict'

var gElCanvas
var gCtx
var gIsDragging = false
var gDraggedLineIdx = null
var gLastPos = null

var MOVE_DELTA = 5

var gEditorDefaults = {
    color: '#ff0000',
    strokeColor: '#000000',
    font: 'Arial',
    size: 22
}

function initMemeEditor() {
    gElCanvas = document.querySelector('#meme-canvas')
    if (!gElCanvas) return
    gCtx = gElCanvas.getContext('2d')

    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)

    syncColorButtonsWithLine()
    updateEditorInputs()
    renderTags()
}

function renderMeme() {
    var meme = getMeme()
    var img = getImgById(meme.selectedImgId)
    if (!gElCanvas || !gCtx || !img) return

    var elImg = new Image()
    elImg.src = img.url

    elImg.onload = function () {
        gElCanvas.width = elImg.width
        gElCanvas.height = elImg.height
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)



        meme.lines.forEach(line => {
            if (!line.__fixed) {
                line.x = gElCanvas.width / 2

                if (line.y === 80 || line.y === undefined || line.y === null) {
                    line.y = gElCanvas.height * 0.12
                }

                line.__fixed = true
            }
        })


        meme.lines.forEach(function (line, idx) {
            var fillColor = line.color || '#ff0000'
            var strokeColor = line.strokeColor || '#000000'
            var font = line.font || 'Arial'
            var align = line.align || 'center'
            var stroke = Math.max(1, line.size * 0.05)

            gCtx.font = line.size + 'px ' + font
            gCtx.textAlign = align
            gCtx.textBaseline = 'middle'
            gCtx.fillStyle = fillColor
            gCtx.strokeStyle = strokeColor
            gCtx.lineWidth = stroke

            gCtx.strokeText(line.txt, line.x, line.y)
            gCtx.fillText(line.txt, line.x, line.y)

            if (meme.isLineSelected && idx === meme.selectedLineIdx) {
                var rect = getLineRect(line)
                gCtx.strokeStyle = '#0155a8ff'
                gCtx.strokeRect(rect.x, rect.y, rect.w, rect.h)
            }
        })
    }
}

function updateEditorInputs() {
    var meme = getMeme()

    if (meme.lines.length === 0) {
        document.querySelector('.text-input').value = ''
        document.querySelector('#line-index').textContent = '0'
        document.querySelector('#line-count').textContent = '0'
        return
    }

    var line = meme.lines[meme.selectedLineIdx]
    if (!line) return

    var elTextInput = document.querySelector('.text-input')
    var elTextColor = document.querySelector('.text-color-input')
    var elStrokeColor = document.querySelector('.stroke-color-input')
    var elFontSelect = document.querySelector('.font-select')
    var elLineIndex = document.querySelector('#line-index')
    var elLineCount = document.querySelector('#line-count')

    if (elTextInput) {
        elTextInput.value = line.txt
        elTextInput.focus()
        elTextInput.setSelectionRange(
            elTextInput.value.length,
            elTextInput.value.length
        )
    }
    if (elTextColor) elTextColor.value = line.color || '#ff0000'
    if (elStrokeColor) elStrokeColor.value = line.strokeColor || '#000000'
    if (elFontSelect) elFontSelect.value = line.font || 'Arial'
    if (elLineIndex) elLineIndex.textContent = meme.selectedLineIdx + 1
    if (elLineCount) elLineCount.textContent = meme.lines.length

    syncColorButtonsWithLine()
    updateSaveCopyVisibility()
}


function onSetLineTxt(txt) {
    var meme = getMeme()
    meme.isLineSelected = true
    setLineTxt(txt)
    renderMeme()
}

function onSetColor(color) {
    var meme = getMeme()
    meme.isLineSelected = true
    setLineColor(color)
    gEditorDefaults.color = color
    syncColorButtonsWithLine()
    renderMeme()
}

function onSetStrokeColor(color) {
    setStrokeColor(color)
    gEditorDefaults.strokeColor = color
    syncColorButtonsWithLine()
    renderMeme()
}

function onSetFont(font) {
    setFont(font)
    gEditorDefaults.font = font
    renderMeme()
}

function onFontSelected(font) {
    var meme = getMeme()
    meme.isLineSelected = true
    setFont(font)
    gEditorDefaults.font = font
    updateEditorInputs()
    renderMeme()
}

function onChangeFontSize(diff) {
    changeFontSize(diff)
    var meme = getMeme()
    var line = meme.lines[meme.selectedLineIdx]
    if (line) gEditorDefaults.size = line.size
    renderMeme()
}

function onDownloadMeme() {
    var meme = getMeme()
    meme.isLineSelected = false
    renderMeme()
    setTimeout(function () {
        var link = document.createElement('a')
        link.download = 'meme.png'
        link.href = gElCanvas.toDataURL('image/png')
        link.click()
        meme.isLineSelected = true
        renderMeme()
    }, 30)
}

function onAddLine() {
    var meme = getMeme()
    meme.isLineSelected = true
    addLine()
    var line = meme.lines[meme.selectedLineIdx]
    if (line) {
        line.color = gEditorDefaults.color
        line.strokeColor = gEditorDefaults.strokeColor
        line.font = gEditorDefaults.font
        line.size = gEditorDefaults.size
        if (gElCanvas) {
            line.x = gElCanvas.width / 2
        }
    }
    updateEditorInputs()
    renderMeme()
}

function onSwitchLine() {
    var meme = getMeme()
    meme.isLineSelected = true
    switchLine()
    updateEditorInputs()
    renderMeme()
}

function onDeleteLine() {
    deleteLine()
    updateEditorInputs()
    renderMeme()
}

function onAddSticker(emoji) {
    var elInput = document.querySelector('.text-input')
    if (!elInput) return
    elInput.value += emoji
    onSetLineTxt(elInput.value)
}

function onDown(ev) {
    var meme = getMeme()
    meme.isLineSelected = false
    renderMeme()

    var offsetX = ev.offsetX
    var offsetY = ev.offsetY

    for (var i = meme.lines.length - 1; i >= 0; i--) {
        var line = meme.lines[i]
        var rect = getLineRect(line)
        if (
            offsetX >= rect.x &&
            offsetX <= rect.x + rect.w &&
            offsetY >= rect.y &&
            offsetY <= rect.y + rect.h
        ) {
            meme.isLineSelected = true
            setSelectedLine(i)
            gDraggedLineIdx = i
            gIsDragging = true
            gLastPos = { x: offsetX, y: offsetY }
            gElCanvas.style.cursor = 'grabbing'
            updateEditorInputs()
            renderMeme()
            return
        }
    }
}

function onMove(ev) {
    var offsetX = ev.offsetX
    var offsetY = ev.offsetY
    var meme = getMeme()

    if (!gIsDragging) {
        var hovering = false
        for (var i = meme.lines.length - 1; i >= 0; i--) {
            var line = meme.lines[i]
            var rect = getLineRect(line)
            if (
                offsetX >= rect.x &&
                offsetX <= rect.x + rect.w &&
                offsetY >= rect.y &&
                offsetY <= rect.y + rect.h
            ) {
                hovering = true
                break
            }
        }
        gElCanvas.style.cursor = hovering ? 'grab' : 'default'
        return
    }

    var line = meme.lines[gDraggedLineIdx]
    var dx = offsetX - gLastPos.x
    var dy = offsetY - gLastPos.y

    line.x += dx
    line.y += dy

    gLastPos = { x: offsetX, y: offsetY }
    gElCanvas.style.cursor = 'grabbing'
    renderMeme()
}

function onUp() {
    gIsDragging = false
    gDraggedLineIdx = null
    gLastPos = null
    if (gElCanvas) gElCanvas.style.cursor = 'default'
}

function onSaveMeme() {
    var meme = getMeme()
    meme.isLineSelected = false
    renderMeme()
    setTimeout(function () {
        if (typeof meme.savedIdx === 'number' && meme.savedIdx >= 0) {
            overwriteSavedMeme(meme.savedIdx)
        } else {
            saveMemeToStorage()
        }
        alert('Meme saved!')
        meme.isLineSelected = true
        renderMeme()
    }, 30)
}

function onSaveMemeCopy() {
    var meme = getMeme()
    meme.isLineSelected = false
    renderMeme()
    setTimeout(function () {
        meme.savedIdx = -1
        saveMemeToStorage()
        alert('Meme saved as copy!')
        meme.isLineSelected = true
        renderMeme()
    }, 30)
}

function getLineRect(line) {
    var font = line.font || 'Arial'
    var align = line.align || 'center'
    gCtx.font = line.size + 'px ' + font
    gCtx.textAlign = align
    gCtx.textBaseline = 'middle'

    var txt = line.txt || ''
    var metrics = gCtx.measureText(txt)
    var width = metrics.width
    var xStart = line.x
    if (align === 'center') xStart = line.x - width / 2
    else if (align === 'right') xStart = line.x - width

    var padding = 10
    var height = line.size

    return {
        x: xStart - padding,
        y: line.y - height / 2 - padding,
        w: width + padding * 2,
        h: height + padding * 2
    }
}

function syncColorButtonsWithLine() {
    var meme = getMeme()
    var line = meme.lines[meme.selectedLineIdx]
    if (!line) return

    var textA = document.querySelector('.text-color-A')
    var strokeA = document.querySelector('.stroke-color-A')
    var textInput = document.querySelector('.text-color-input')
    var strokeInput = document.querySelector('.stroke-color-input')

    if (textA) textA.style.color = line.color || '#ff0000'
    if (strokeA) {
        var c = line.strokeColor || '#000000'
        strokeA.style.color = '#ffffff'
        strokeA.style.textShadow =
            '-0.5px -0.5px ' + c +
            ', 0.5px -0.5px ' + c +
            ', -0.5px 0.5px ' + c +
            ', 0.5px 0.5px ' + c
    }
    if (textInput) textInput.value = line.color || '#ff0000'
    if (strokeInput) strokeInput.value = line.strokeColor || '#000000'
}

function updateSaveCopyVisibility() {
    var meme = getMeme()
    var btn = document.querySelector('.btn-save-copy')
    if (!btn) return
    if (typeof meme.savedIdx === 'number' && meme.savedIdx >= 0) {
        btn.classList.remove('hidden')
    } else {
        btn.classList.add('hidden')
    }
}

function onMoveUp() {
    var meme = getMeme()
    var line = meme.lines[meme.selectedLineIdx]
    if (!line) return
    line.y -= MOVE_DELTA
    renderMeme()
}

function onMoveDown() {
    var meme = getMeme()
    var line = meme.lines[meme.selectedLineIdx]
    if (!line) return
    line.y += MOVE_DELTA
    renderMeme()
}

function onMoveLeft() {
    var meme = getMeme()
    var line = meme.lines[meme.selectedLineIdx]
    if (!line) return
    line.x -= MOVE_DELTA
    renderMeme()
}

function onMoveRight() {
    var meme = getMeme()
    var line = meme.lines[meme.selectedLineIdx]
    if (!line) return
    line.x += MOVE_DELTA
    renderMeme()
}

function onCenterLine() {
    var meme = getMeme()
    var line = meme.lines[meme.selectedLineIdx]
    if (!line || !gElCanvas) return

    line.x = gElCanvas.width / 2
    line.y = gElCanvas.height / 2

    renderMeme()
}

function toggleEmojiBox() {
    var el = document.querySelector('.emoji-box')
    if (!el) return
    el.classList.toggle('hidden')
}

function resetMemeToDefault() {
    var currentId = getMeme().selectedImgId || 1

    gMeme = createInitialMeme()
    gMeme.selectedImgId = currentId

    var line = gMeme.lines[0]

    line.color = gEditorDefaults.color
    line.strokeColor = gEditorDefaults.strokeColor
    line.font = gEditorDefaults.font
    line.size = gEditorDefaults.size

    line.x = gElCanvas ? gElCanvas.width / 2 : 250
    line.y = 80

    gMeme.selectedLineIdx = 0
    gMeme.isLineSelected = true
}


function applyEditorDefaults() {
    var meme = getMeme()
    if (!meme.lines.length) {
        resetMemeToDefault()
        return
    }
    var line = meme.lines[meme.selectedLineIdx]
    line.color = line.color || gEditorDefaults.color
    line.strokeColor = line.strokeColor || gEditorDefaults.strokeColor
    line.font = line.font || gEditorDefaults.font
    line.size = line.size || gEditorDefaults.size
    updateEditorInputs()
}

window.addEventListener('click', function (ev) {
    var box = document.querySelector('.emoji-box')
    var toggle = document.querySelector('.emoji-toggle')
    if (!box || box.classList.contains('hidden')) return
    if (box.contains(ev.target)) return
    if (toggle && toggle.contains(ev.target)) return
    box.classList.add('hidden')
})

function renderTags() {
    var meme = getMeme()
    var img = getImgById(meme.selectedImgId)
    var elList = document.querySelector('.tag-list')
    if (!elList || !img) return

    elList.innerHTML = img.keywords.map(function (tag, idx) {
        return (
            '<div class="tag-item">' +
            '<span>' + tag + '</span>' +
            '<button class="tag-remove-btn" onclick="onDeleteTag(' + idx + ')">✕</button>' +
            '</div>'
        )
    }).join('')
}

function onShowTagInput() {
    var elInput = document.querySelector('.tag-editor-input')
    if (!elInput) return
    elInput.classList.remove('hidden')
    elInput.focus()
}

function onTagInputKey(ev) {
    if (ev.key !== 'Enter') return
    var elInput = ev.target
    var txt = elInput.value.trim()
    if (!txt) return

    var meme = getMeme()
    addTagToImg(meme.selectedImgId, txt)

    elInput.value = ''
    elInput.classList.add('hidden')
    renderTags()
}

function onDeleteTag(idx) {
    var meme = getMeme()
    var keywords = getKeywordsForImg(meme.selectedImgId)
    if (!keywords || idx < 0 || idx >= keywords.length) return
    var tag = keywords[idx]

    deleteTagFromImg(meme.selectedImgId, tag)
    renderTags()
}

window.addEventListener('click', function (ev) {
    var input = document.querySelector('.tag-editor-input')
    var btn = document.querySelector('.tag-custom-btn')

    if (!input || input.classList.contains('hidden')) return

    if (input.contains(ev.target) || (btn && btn.contains(ev.target))) return

    var txt = input.value.trim()
    if (txt) {
        var meme = getMeme()
        addTagToImg(meme.selectedImgId, txt)
        renderTags()
    }

    input.value = ''
    input.classList.add('hidden')
})
