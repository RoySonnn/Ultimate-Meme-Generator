'use strict'

var gLastScreen = 'gallery'

function onInit() {
  initImgs()
  renderGallery()
  initMemeEditor()
  syncColorButtonsWithLine()

  document.querySelector('.gallery .search-input')
    .addEventListener('input', onSearch)

  document.querySelector('.saved-memes .search-input')
    .addEventListener('input', onSearchSaved)

}


function openMobileMenu() {
  var el = document.querySelector('.mobile-menu')
  if (el) el.classList.remove('hidden')
}

function closeMobileMenu() {
  var el = document.querySelector('.mobile-menu')
  if (el) el.classList.add('hidden')
}


function clearAllSearchInputs() {
  var searchInputs = document.querySelectorAll('.search-input')
  searchInputs.forEach(input => input.value = '')
}
