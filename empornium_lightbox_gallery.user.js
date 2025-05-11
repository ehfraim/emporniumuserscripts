// ==UserScript==
// @name         empornium lightbox gallery
// @namespace    https://www.empornium.is
// @version      1.2.1.1
// @description  add a lightbox gallery to torrent pages
// @author       ephraim
// @match        https://www.empornium.is/torrents.php?id=*
// @match        https://www.empornium.me/torrents.php?id=*
// @match        https://www.empornium.sx/torrents.php?id=*
// @grant        GM_addElement
// @require      https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js
// @inject-into  page
// @downloadURL  https://update.sleazyfork.org/scripts/521153/empornium%20lightbox%20gallery.user.js
// @updateURL    https://update.sleazyfork.org/scripts/521153/empornium%20lightbox%20gallery.meta.js
// ==/UserScript==

GM_addElement('link', {
  rel: 'stylesheet',
  referrerpolicy: 'no-referrer',
  href: "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css"
})

// make fancybox available to the page and other scripts
unsafeWindow.Fancybox = Fancybox

var descbox = document.querySelector('#descbox')

// make thumbnails of fullsize images
var jerkingSrcQuery = `img[src*="jerking.empornium"]:not([src*=".th."], [src*=".md."], [src*="poster" i],
                      [src$=".png"],[src$="cast11.jpg"], [src$="plot11.jpg"], [src$="info11.jpg"], [src$="screens11.jpg"], [src$="finger-pointing-down.gif"])`
var fappingSrcQuery = jerkingSrcQuery.replace('jerking', 'fapping')
var hamsterSrcQuery = jerkingSrcQuery.replace('jerking.empornium', 'hamster.is')
var srcQuery = `${jerkingSrcQuery}, ${fappingSrcQuery}, ${hamsterSrcQuery}`
var dataSrcQuery = srcQuery.replaceAll('[src', '[data-src')
var fullsize = descbox.querySelectorAll(`${srcQuery}, ${dataSrcQuery}`)

fullsize.forEach(i => {
  var src = i.src || i.dataset.src
  var thumbSrc = /images\/fi/.test(src) ? src.replace('image-', 'thumb-') : src.replace(/\.(?=\w*$)/, '.th.')
  if (!(i.hasAttribute('width') || /\.gif/.test(src))) {
    i.src = thumbSrc
    i.dataset.src = thumbSrc
  }
  var a = document.createElement('a')
  a.className = 'lightbox-image'
  var parent = i.parentElement
  if (parent.tagName === "A") {
    parent.parentElement.insertBefore(a, parent)
    parent.remove()
  } else {
    parent.insertBefore(a, i)
  }
  a.append(i)
})

// put thumbnails on one row
document.querySelectorAll('a.lightbox-image + br').forEach(br => { br.remove() })

//find links to fullsize images without thumbnails
var fullsizeLinks = descbox.querySelectorAll('a[href*="jerking.empornium"]:not(:has(img)):not([href*="/album/"])',
                                             'a[href*="fapping.empornium"]:not(:has(img)):not([href*="/album/"])',
                                             'a[href*="hamster.is"]:not(:has(img)):not([href*="/album/"])')
fullsizeLinks.forEach(f => {
  var th = document.createElement('img')
  th.className = 'bbcode scale_image'
  th.alt = f.href
  if (!/\.gif$/.test(th.alt)) {
    if (/images\/fi/.test(th.alt)) {
      //th.src = f.href
      th.src = f.href.replace('image-', 'thumb-')
    } else {
      th.src = f.href.replace(/\.(?=\w*$)/, '.th.')
    }
  }
  th.style.display = 'none'
  th.loading = "lazy"
  f.append(th)
  f.className += 'lightbox-image'
})

//find thumbnails with links to fullsize
var images = descbox.querySelectorAll(`a[href^="https://jerking.empornium"]:has(img[src*=".th."], img[src*=".md."], [src*="/thumb-"], img[data-src*=".th."], img[data-src*=".md."]),
                                       a[href^="https://fapping.empornium"]:has(img[src*=".th."], img[src*=".md."], [src*="/thumb-"], img[data-src*=".th."], img[data-src*=".md."]),
                                       a[href^="https://hamster.is"]:has(img[src*=".th."], img[src*=".md."], [src*="/thumb-"], img[data-src*=".th."], img[data-src*=".md."]),
                                       a.lightbox-image`)
images.forEach(a => {
  var thumb = a.querySelector('img')
  var thumbUrl = thumb.dataset.src || thumb.src
  var fullUrl = /thumb-/.test(thumbUrl) ? thumbUrl.replace('thumb-', 'image-') : thumbUrl.replace(/\.(?:th|md)\.(?=\w*$)/i, '.')
  var fullName = fullUrl.split('/').pop()

  a.removeAttribute('target')
  thumb.removeAttribute('onclick')
  a.href = fullUrl
  a.dataset.fancybox = 'gallery'
  a.dataset.caption = `<a href="${fullUrl}" style="color:white;">${fullName}</a>`
})

Fancybox.bind('[data-fancybox="gallery"]', {
  wheel: "slide",
  animationDuration: 100,
  contentClick: "toggleCover",
  contentDblClick: "zoomToMax",
  Toolbar: {
    display: {
      left: ["infobar"],
      middle: [
        "zoomIn",
        "zoomOut",
        "toggle1to1",
        "rotateCCW",
        "rotateCW",
        "thumbs",
      ],
      right: ["close"],
    },
  },
  Thumbs: {
    type: "classic",
  },
  Images: {
    Panzoom: {
      maxScale: 2,
      panMode: "mousemove",
      mouseMoveFriction: 0.2,
      mouseMoveFactor: 1.2
    }
  }
});