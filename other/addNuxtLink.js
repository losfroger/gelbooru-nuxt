// ==UserScript==
// @name         Add gelbooru nuxt link
// @namespace    http://tampermonkey.net/
// @version      2023-12-12
// @description  Add a link to go to the nuxt page of the post.
// @author       Losfroger
// @match        https://gelbooru.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gelbooru.com
// @grant        none
// ==/UserScript==

(function () {
  'use strict'

  const currentUrl = window.location.href

  // Exit if not a post page
  if (!currentUrl.includes('?page=post')) {
    return
  }

  const rePostId = /(?<=id=)[0-9]*/
  const postId = currentUrl.match(rePostId)

  // If no Id is found, return
  if (!postId || postId.length < 1) {
    return
  }

  const titleEl = document.createElement('li')
  titleEl.setAttribute('style', 'margin-top: 10px;')
  titleEl.innerHTML = '<b>Nuxt</b>'

  const linkEl = document.createElement('li')
  linkEl.innerHTML = `<a href="https://gelbooru-nuxt.vercel.app/post/${postId.at(0) ?? '0'}" target="_blank" rel="noopener noreferrer">Gelbooru Nuxt</a>`

  document.getElementById('tag-list').prepend(titleEl, linkEl)
})()
