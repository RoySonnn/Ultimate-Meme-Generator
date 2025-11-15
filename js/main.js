'use strict'

var gLastScreen = 'gallery'

function onInit() {
  initImgs()
  renderGallery()
  renderTagOptions()
  initMemeEditor()

  var savedSearch = document.querySelector('.saved-memes .search-input')
  if (savedSearch) savedSearch.addEventListener('input', onSearchSaved)
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
  document.querySelectorAll('.search-input')
    .forEach(input => input.value = '')

  var tagInput = document.querySelector('.tag-search-input')
  if (tagInput) tagInput.value = ''

  var dropdown = document.querySelector('.tag-dropdown')
  if (dropdown) dropdown.classList.add('hidden')
}

