// ==UserScript==
// @name           Empornium add preview thumbnail
// @description    Lazy loads thumbnails
// @author         ephfraim
// @namespace      empornium
// @include        https://www.empornium.tld/*
// @exclude        https://www.empornium.tld/torrents.php?id=*
// @version        6
// @grant          none
// run-at          document-idle
// ==/UserScript==

var preloadFullSizeImages = true;

document.querySelectorAll('tr.torrent').forEach(torrent => {
    addPlaceHolder(torrent);
});

async function loadImage(image) {
	try {
		// make animated gifs static at first
		if (/\.gif/.test(image.dataset.thumbUrl)) {
			image.src = image.dataset.thumbUrl.replace('.gif', '.th.gif');
		}		
		var result = await getImage(image.dataset.thumbUrl);
		image.src = image.dataset.thumbUrl;
	} catch(error) {
		image.src = 'https://xxx.freeimage.us/thumb.php?id=D9D0_5A1E8C7B';
		//image.src = 'https://fapping.empornium.sx/images/2017/11/29/Broken-Image.th.png'; // backup
	}
}

function getImage(url, imageToGet) {
	return new Promise((resolve, reject) => {
		var image = new Image();
		image.src = url;
		image.onload = () => {resolve(imageToGet)}
        image.onerror = () => {reject(new Error())}
	});
}


var lazyImageObserver = new IntersectionObserver((entries, observer) => {
    for (var entry of entries) {
        if (entry.isIntersecting) {
			var lazyImage = entry.target;
			loadImage(lazyImage);

            if (preloadFullSizeImages) {
				getImage(lazyImage.dataset.fullImage, lazyImage).then(thumb => {
                    thumb.classList.add('fullsize-loaded');
				});
            }
            lazyImage.classList.remove('lazy-img');
            lazyImageObserver.unobserve(lazyImage);
        }
    }
}, {rootMargin: "300px"}); //start loading image before it is visable

document.querySelectorAll('.preview-thumb').forEach(lazyImage => {
    lazyImageObserver.observe(lazyImage);
});


function addPlaceHolder(torrent) {
    var torrentId = torrent.querySelector('a[href*="/torrents.php?id"]').href.match(/id=(\d+)/)[1];

    var placeholderImg = new Image();
    placeholderImg.src = 'https://www.empornium.me/favicon.ico';
    placeholderImg.className = 'preview-thumb lazy-img';
    placeholderImg.id = 'preview-' + torrentId;

    var imageUrl = getImgUrl(torrent);
    placeholderImg.dataset.thumbUrl = getThumbURL(imageUrl);
    placeholderImg.dataset.fullImage = imageUrl.replace(/\.th\.|\.md\./i, '.');
	placeholderImg.addEventListener('click', showModal, false);

    var previewDiv = document.createElement('div');
    previewDiv.className = 'preview-div';
    previewDiv.appendChild(placeholderImg);
    var category = torrent.querySelector('.cats_col');
    if (!category) category = torrent.querySelector('.cats_cols');
    category.children[0].style.display = "inline";
    category.style.whiteSpace = "nowrap";
    category.appendChild(previewDiv);
}

function getImgUrl(torrent) {
    var script = torrent.querySelector('script').innerHTML.replace(/\\\//g, '/').replace(/\\"/g, '');
    let dummy = document.createElement('div');
    dummy.innerHTML = script.slice(script.indexOf('=') + 3, -1); //cut out just the html
    return dummy.querySelector('img').src;
}

function getThumbURL(imgURL) {
    let thumbURL = imgURL.replace('&gif', '');
    if (!/(th\.jpg|th\.png)|(freeimage|imgbox)|(\.jpg\.)/.test(imgURL)) {
        if (/\.md\./i.test(imgURL)) {
            thumbURL = imgURL.replace(".md.", ".th.");
        } else if (/\.jpg/i.test(imgURL)) {
            thumbURL = imgURL.replace(".jpg", ".th.jpg");
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

    pic.onload = function() {
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

var previewStyle = document.createElement('style');
previewStyle.type = 'text/css';
previewStyle.appendChild(document.createTextNode(`
.preview-thumb {
  width: 100%;
  cursor: zoom-in;
}

.preview-div {
  display: inline-block;
  width: 80px;
  height: 80px;
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
`));
document.head.appendChild(previewStyle);
