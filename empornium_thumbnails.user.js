// ==UserScript==
// @name           Empornium add preview thumbnail
// @namespace      empornium
// @description    Adds preview thumbnails to torrent rows
// @include        https://www.empornium.me/*
// @include        https://www.empornium.sx/*
// @grant          none
// run-at          document-idle
// ==/UserScript==

var torrents = document.querySelectorAll('tr.torrent');
var index = 0;
for (var torrent of torrents) {
  var script = torrent.querySelector('script').innerHTML.replace(/\\\//g, '/').replace(/\\"/g,'');
  let dummy = document.createElement('div');
  dummy.innerHTML = script.slice(script.indexOf('=') + 3, -1);  // cut out just the html
  let imgURL = dummy.querySelector('img').src;
  let thumbURL = imgURL.replace('&gif', '');
    if (!/(th\.jpg|th\.png)|(freeimage|imgbox)|(\.jpg\.)/.test(imgURL)) {
    if (/\.md\./i.test(imgURL)) thumbURL = imgURL.replace(".md.", ".th.");
    else if (/\.jpg/i.test(imgURL)) thumbURL = imgURL.replace(".jpg", ".th.jpg");
    else if (!/noimage/.test(imgURL)) {
      thumbURL = thumbURL.replace(/\.md\.png|\.png/i, ".th.png");
      }
    }

  var previewImg = new Image();
  previewImg.id = 'preview' + index;

  var tempImg = new Image();
  tempImg.dataset.preview = 'preview' + index;
  tempImg.src = thumbURL;
  tempImg.onload = function () {
    var previewImgEl = document.getElementById(this.dataset.preview);
    previewImgEl.src = this.src;
    previewImgEl.style.opacity = "1";
  };
  tempImg.onerror = function() {
    var previewImgEl = document.getElementById(this.dataset.preview);
    // previewImgEl.src = 'https://fapping.empornium.sx/images/2017/11/29/Broken-Image.th.png';
    previewImgEl.src = 'https://xxx.freeimage.us/thumb.php?id=D9D0_5A1E8C7B'; // broken image url
    previewImgEl.style.opacity = "1";
    previewImgEl.style.height = '50px';
  }; 
  previewImg.dataset.fullImage = imgURL.replace(/\.th\.|\.md\./i, '.');
  previewImg.className = 'preview-thumb';
  var previewDiv = document.createElement('div');
  previewDiv.className = 'preview-div';
  previewDiv.appendChild(previewImg);
  previewImg.addEventListener('click', showModal, false);
  var category = torrent.querySelector('.cats_col');
  category.children[0].style.display = "inline";
  category.style.whiteSpace = "nowrap";
  category.appendChild(previewDiv);
  
  // preload the full size images
  // var preloadImg = new Image();
  // preloadImg.src = previewImg.dataset.fullImage;

  index++;
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
    window.getComputedStyle(pic).width;
    pic.style.transition = 'transform 0.5s, opacity 1.0s, linear';
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

var previewStyle = document.createElement('style');
previewStyle.innerHTML(`
.preview-thumb {
  max-height: 100px;
  max-width: 100px;
  cursor: zoom-in;
  opacity: 0;
  transition: opacity 0.2s;
}

.preview-div {
  display: inline-block;
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
`);
document.head.appendChild(previewStyle);
