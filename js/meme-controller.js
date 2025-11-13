'use strict'

var gElCanvas
var gCtx
var gIsDragging = false
var gDraggedLineIdx = null
var gLastPos = null

function initMemeEditor() {
    gElCanvas = document.querySelector('#meme-canvas')
    if (!gElCanvas) return
    gCtx = gElCanvas.getContext('2d')

    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)

    syncColorButtonsWithLine()
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

        meme.lines.forEach(function (line, idx) {

            var fillColor = line.color || '#000000'
            var strokeColor = line.strokeColor || '#ff0000'
            var font = line.font || 'Comic Sans MS'
            var align = line.align || 'center'

            var stroke = Math.max(1, line.size * 0.05)

            gCtx.font = line.size + 'px ' + font
            gCtx.textAlign = align
            gCtx.textBaseline = 'middle'

            gCtx.fillStyle = fillColor
            gCtx.strokeStyle = strokeColor

            gCtx.lineWidth = stroke
            gCtx.lineJoin = 'round'
            gCtx.miterLimit = 2

            gCtx.strokeText(line.txt, line.x, line.y)
            gCtx.fillText(line.txt, line.x, line.y)

            if (idx === meme.selectedLineIdx) {
                var rect = getLineRect(line)
                gCtx.strokeStyle = 'blue'
                gCtx.strokeRect(rect.x, rect.y, rect.w, rect.h)
            }
        })
    }
}


function updateEditorInputs() {
    var meme = getMeme()
    var line = meme.lines[meme.selectedLineIdx]
    if (!line) return

    var elTextInput = document.querySelector('.text-input')
    var elFontSelect = document.querySelector('.font-row select')
    var elLineIndex = document.querySelector('#line-index')
    var elLineCount = document.querySelector('#line-count')

    if (elTextInput) elTextInput.value = line.txt
    if (elFontSelect) elFontSelect.value = line.font || 'Impact'
    if (elLineIndex) elLineIndex.textContent = meme.selectedLineIdx + 1
    if (elLineCount) elLineCount.textContent = meme.lines.length

    syncColorButtonsWithLine()

    if (elTextInput) elTextInput.focus()
}

function onSetLineTxt(txt) {
    setLineTxt(txt)
    renderMeme()
}

function onSetColor(color) {
    setLineColor(color)
    var el = document.querySelector('.text-color-A')
    if (el) el.style.color = color
    renderMeme()
}

function onSetStrokeColor(color) {
    setStrokeColor(color)
    var el = document.querySelector('.stroke-color-A')
    if (el) {
        el.style.color = '#ffffff'
        el.style.textShadow =
            '-0.5px -0.5px ' + color +
            ', 0.5px -0.5px ' + color +
            ', -0.5px 0.5px ' + color +
            ', 0.5px 0.5px ' + color
    }
    renderMeme()

}

function onSetFont(font) {
    setFont(font)
    renderMeme()
}

function onSetAlign(align) {
    setAlign(align)
    renderMeme()
}

function onDownloadMeme() {
    if (!gElCanvas) return
    var link = document.createElement('a')
    link.download = 'meme.png'
    link.href = gElCanvas.toDataURL('image/png')
    link.click()
}

function onChangeFontSize(diff) {
    changeFontSize(diff)
    renderMeme()
}

function onAddLine() {
    addLine()
    updateEditorInputs()
    renderMeme()
}

function onSwitchLine() {
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
    var offsetX = ev.offsetX
    var offsetY = ev.offsetY
    var meme = getMeme()

    for (var i = meme.lines.length - 1; i >= 0; i--) {
        var line = meme.lines[i]
        var rect = getLineRect(line)
        if (
            offsetX >= rect.x &&
            offsetX <= rect.x + rect.w &&
            offsetY >= rect.y &&
            offsetY <= rect.y + rect.h
        ) {
            setSelectedLine(i)
            gDraggedLineIdx = i
            gIsDragging = true
            gLastPos = { x: offsetX, y: offsetY }
            var elCanvas = gElCanvas
            if (elCanvas) elCanvas.style.cursor = 'grabbing'
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
        if (gElCanvas) gElCanvas.style.cursor = hovering ? 'grab' : 'default'
        return
    }

    var line = meme.lines[gDraggedLineIdx]
    var dx = offsetX - gLastPos.x
    var dy = offsetY - gLastPos.y

    line.x += dx
    line.y += dy

    gLastPos = { x: offsetX, y: offsetY }
    if (gElCanvas) gElCanvas.style.cursor = 'grabbing'
    renderMeme()
}

function onUp() {
    gIsDragging = false
    gDraggedLineIdx = null
    gLastPos = null
    if (gElCanvas) gElCanvas.style.cursor = 'default'
}

function onSaveMeme() {
    saveMemeToStorage()
    alert('Meme saved!')
}

function getLineRect(line) {
    var font = line.font || 'Impact'
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

    if (textA) textA.style.color = line.color
    if (strokeA) {
        strokeA.style.color = '#ffffff'
        strokeA.style.textShadow =
            '-0.5px -0.5px ' + line.strokeColor +
            ', 0.5px -0.5px ' + line.strokeColor +
            ', -0.5px 0.5px ' + line.strokeColor +
            ', 0.5px 0.5px ' + line.strokeColor

    }
    if (textInput) textInput.value = line.color
    if (strokeInput) strokeInput.value = line.strokeColor
}

function openTextColorPicker() {
    var el = document.querySelector('.text-color-input')
    if (el) el.click()
}

function openStrokeColorPicker() {
    var el = document.querySelector('.stroke-color-input')
    if (el) el.click()
}
