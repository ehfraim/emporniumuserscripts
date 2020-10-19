// ==UserScript==
// @name           Empornium add preview thumbnail
// @description    Lazy loads thumbnails
// @author         ephraim
// @namespace      empornium
// @include        https://www.empornium.tld/top10.php
// @include        https://www.empornium.tld/torrents.php*
// @exclude        https://www.empornium.tld/torrents.php?id=*
// @version        7
// @grant          none
// @run-at         document-body
// ==/UserScript==

var preloadFullSizeImages = false;
var previewSize = 100;


async function loadImage(pdiv) {
    try {
        // make animated gifs static at first
        if (/\.gif/.test(pdiv.dataset.thumbUrl)) {
            var gifThumb = pdiv.dataset.thumbUrl.replace('.gif', '.th.gif');
            pdiv.style.backgroundImage = `url(${gifThumb})`;
            return;
        } else if (/&gif/.test(pdiv.dataset.thumbUrl)) { // freeimage animated gif
            var gifThumb = pdiv.dataset.thumbUrl.replace('&gif', '');
            pdiv.style.backgroundImage = `url(${gifThumb})`;
            return;
        }
        // var result = await getImage(pdiv.dataset.thumbUrl);
        pdiv.style.backgroundImage = `url(${pdiv.dataset.thumbUrl})`;
        pdiv.classList.remove('placeholder');
    } catch (error) {
        pdiv.style.backgroundImage = `url(https://xxx.freeimage.us/thumb.php?id=D9D0_5A1E8C7B)`;
        //pdiv.src = 'https://xxx.freeimage.us/thumb.php?id=D9D0_5A1E8C7B';
        //image.src = 'https://fapping.empornium.sx/images/2017/11/29/Broken-Image.th.png'; // backup
    }
}


function getImage(url, imageToGet) {
    return new Promise((resolve, reject) => {
        var image = new Image();
        image.src = url;
        image.onload = () => { resolve(imageToGet); };
        image.onerror = () => { reject(new Error()); };
    });
}


var lazyImageObserver = new IntersectionObserver((entries) => {
    for (var entry of entries) {
        if (entry.isIntersecting) {
            var lazyImage = entry.target;
            loadImage(lazyImage);

            if (preloadFullSizeImages) {
                getImage(lazyImage.dataset.fullImage, lazyImage).then(thumb => {
                    thumb.classList.add('fullsize-loaded');
                });
            }
            lazyImage.classList.remove('placeholder');
            lazyImageObserver.unobserve(lazyImage);
        }
    }
}, { rootMargin: "400px" }); //start loading image before it is visible


function addPlaceHolder(torrent) {
    var torrentId = torrent.querySelector('a[href*="/torrents.php?id"]').search.slice(4);
    var imageUrl = getImgUrl(torrent);

    var previewDiv = document.createElement('div');
    previewDiv.className = 'preview-div placeholder';
    previewDiv.id = 'preview-' + torrentId;
    previewDiv.dataset.thumbUrl = getThumbURL(imageUrl);
    previewDiv.dataset.fullImage = imageUrl.replace(/\.th\.|\.md\./i, '.');
    previewDiv.addEventListener('click', showModal, false);

    var category = torrent.querySelector('.cats_col, .cats_cols');
    category.classList.add('preview-column');
    category.firstElementChild.classList.add('preview-category');
    category.appendChild(previewDiv);
}

function getImgUrl(torrent) {
    var script = torrent.querySelector('script').innerHTML.replace(/\\\//g, '/').replace(/\\"/g, '');
    return script.match(/src=([\w\W]*)><\/td/)[1].replace('&amp;', '&');
}


function getThumbURL(imgURL) {
    let thumbURL = imgURL;
    if (!/(th\.jpg|th\.png)|(freeimage|imgbox)|(\.jpg\.)/.test(imgURL)) {
        if (/\.md\./i.test(imgURL)) {
            thumbURL = imgURL.replace(".md.", ".th.");
        } else if (/\.jpg/i.test(imgURL)) {
            thumbURL = imgURL.replace(/\.jpg$/, ".th.jpg");
        } else if (!/noimage/.test(imgURL)) {
            thumbURL = thumbURL.replace(/\.md\.png|\.png/i, ".th.png");
        }
    }
    return thumbURL;
}


function showModal() {
    var img = this;
    document.getElementById('wrapper').classList.add('blurry');
    var myModal = document.createElement('div');
    myModal.className = 'modal-preview';
    myModal.id = 'blurbox';
    myModal.addEventListener('click', hideModal);
    document.body.appendChild(myModal);
    var pic = new Image();
    pic.classList.add('modal-content');
    pic.style.willChange = 'transform, opacity';

    pic.onload = function () {
        myModal.appendChild(pic);
        var bRect = img.getBoundingClientRect();
        pic.style.position = 'fixed';
        pic.style.top = bRect.top + 'px';
        pic.style.left = bRect.left + 'px';
        var startScale = bRect.width / pic.naturalWidth;
        pic.style.transformOrigin = '0 0';
        pic.style.transform = 'scale(' + startScale + ')';
        pic.style.opacity = '0.1';
        var throwaway = window.getComputedStyle(pic).width; // trigger css update
        pic.style.transition = 'transform 0.5s, opacity 1.0s, ease-in-out 0.3s';
        var margin = 100;
        var endHeightScale = pic.naturalHeight > window.innerHeight - margin ?
            (window.innerHeight - margin) / pic.naturalHeight : 1;
        var endWidthScale = pic.naturalWidth > window.innerWidth - margin ?
            (window.innerWidth - margin) / pic.naturalWidth : 1;
        var endScale = Math.min(endHeightScale, endWidthScale);
        var endOffsetX = (window.innerWidth / 2) - (bRect.left + (pic.naturalWidth * endScale / 2));
        var endOffsetY = (window.innerHeight / 2) - (bRect.top + (pic.naturalHeight * endScale / 2));
        pic.style.transform = 'translate(' + endOffsetX + 'px,' + endOffsetY + 'px) scale(' + endScale + ')';
        pic.style.opacity = '1';
    };
    pic.src = img.dataset.fullImage;
}


function hideModal() {
    document.getElementById('wrapper').classList.remove('blurry');
    document.getElementById('blurbox').remove();
}

/****   main  ****/
document.querySelectorAll('tr.torrent').forEach(torrent => {
    addPlaceHolder(torrent);
});

document.querySelectorAll('.placeholder').forEach(lazyImage => {
    lazyImageObserver.observe(lazyImage);
});

var previewStyle = document.createElement('style');
previewStyle.type = 'text/css';
previewStyle.appendChild(document.createTextNode(`
.preview-column {
    position: relative;
    display: block;
    height: ${previewSize}px;
    width: ${previewSize+20}px;
}

.preview-category {
    position: absolute;
    left: 0;
    height: ${previewSize}px;
}

.preview-div {
    position: absolute;
    left: 0;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url("https://www.empornium.me/favicon.ico");
    width: ${previewSize}px;
    height: ${previewSize}px;
    margin-left: 20px;
    cursor: zoom-in;
}

.placeholder {
  transform: scale(0.5);
}

.fullsize-loaded {
  outline: solid 2px #9cb7d2;
}

.modal-preview {
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-image: radial-gradient(circle, #0000004d, #000000e6);
}

.modal-content {
  display: block;
  margin-left: auto;
  margin-right: auto;
  border: solid 2px #5a5a5a;
  filter: drop-shadow(0px 20px 25px #000E);
}

.blurry {
  filter: brightness(0.2) grayscale(0.7) blur(1px);
  transition: filter 0.3s linear;
}

.preview-category > a > img {
    height: ${previewSize}px;
    }
`));
document.head.appendChild(previewStyle);
