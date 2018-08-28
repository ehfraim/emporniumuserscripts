// ==UserScript==
// @name         empornium fixed header
// @namespace    https://www.empornium.me/
// @version      1
// @description  Fixes the header on top when scrolling
// @author       ephraim
// @include      https://www.empornium.tld/*
// @grant        none
// ==/UserScript==

var previewStyle = document.createElement('style');
previewStyle.type = 'text/css';
previewStyle.innerHTML = `
  #header {
    position: fixed;
    top: 0;
    background-color: #182236;
    z-index: 1;
    box-shadow: 0 0 10px black;
  }

  #wrapper {
    padding-top: 94px;
  }

  #details-sidebar {
    padding-top: 55px;
}
`;
document.head.appendChild(previewStyle);
