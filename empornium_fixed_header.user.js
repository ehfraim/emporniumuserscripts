// ==UserScript==
// @name         empornium fixed header
// @namespace    https://www.empornium.me/
// @version      2
// @description  Fixes the header on top when scrolling
// @author       ephraim
// @include      https://www.empornium.tld/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

var previewStyle = document.createElement('style');
previewStyle.type = 'text/css';
previewStyle.innerHTML = `
  #header {
    position: sticky;
    top: 0;
    background-color: #182236;
    z-index: 1;
    box-shadow: 0 0 10px black;
  }
`;
document.head.appendChild(previewStyle);
