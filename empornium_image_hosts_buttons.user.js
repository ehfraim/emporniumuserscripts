// ==UserScript==
// @name         Imagehost Buttons
// @namespace    https://www.empornium.me/
// @version      1.0
// @description  Adds buttons linking to all approved imagehosts in the header.
// @author       ephraim
// @include      https://www.empornium.tld/*
// @grant        none
// ==/UserScript==

var hosts = [
  {
    name: 'Jerking',
    url: 'https://jerking.empornium.ph',
    faviconData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjczQUUzMzgyRkY2RTExRTY4RjMyQkVDRkY1NkQ0QkIwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjczQUUzMzgzRkY2RTExRTY4RjMyQkVDRkY1NkQ0QkIwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzNBRTMzODBGRjZFMTFFNjhGMzJCRUNGRjU2RDRCQjAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzNBRTMzODFGRjZFMTFFNjhGMzJCRUNGRjU2RDRCQjAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz40SUXSAAAAGFBMVEX78d8WEBT65iNbSiKYfiHKqh+4oH7q5nY700PdAAAAgUlEQVQIHQXBuw6CQBAF0GuQtb7OSo+a2DI8rF3AUJMB6qWyxUT9fs+BGz7Nr75FrBVFRTNUKsaeJS4ydHfzC3K/CJIhQJs1g5sE7DkjDUd06i3u2SLna8XuZAh+c1vyJNjHw/YNHqIFkLKE8eHiWybkYpxZK0KjfhQTuCvPbEPxB6tPFyx4bsHsAAAAAElFTkSuQmCC',
    favicon: 'https://jerking.empornium.ph/content/images/system/favicon.png'
  },
  {
    name: 'Fapping',
    url: 'https://fapping.empornium.sx',
    faviconData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk2NUMwMERBRkY2RTExRTZBRkIxOTc4RTFCMkU2OEJFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk2NUMwMERCRkY2RTExRTZBRkIxOTc4RTFCMkU2OEJFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTY1QzAwRDhGRjZFMTFFNkFGQjE5NzhFMUIyRTY4QkUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTY1QzAwRDlGRjZFMTFFNkFGQjE5NzhFMUIyRTY4QkUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6CY5cpAAAAGFBMVEUSX576+/1EisS+1eaWu9guerlxocf////+lIoOAAAACHRSTlP/////////AN6DvVkAAAB5SURBVAgdHcHNDsFQEIDRrxjr2/RnXVPjAaT2GsH2mnSsNcIL8P6ROIeP/l05eEi4T2j48IpwLIohmSnWjTl7OCo1EI717X0XW8U2Q13eTg3duNw3c5+wqphTNT6Y0ur9bC+CAsURsAwlCGYsWsicvRPIa76qWULmH9lzFaWcaP5BAAAAAElFTkSuQmCC',
    favicon: 'https://fapping.empornium.sx/content/themes/Peafowl/favicon.ico'
  },
  {
    name: 'www-FreeImage',
    url: 'http://www.freeimage.us',
    faviconData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBBNkVDQjRFRkY2RjExRTZCQURFRDRGNTU4MkVCNTdFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBBNkVDQjRGRkY2RjExRTZCQURFRDRGNTU4MkVCNTdFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEE2RUNCNENGRjZGMTFFNkJBREVENEY1NTgyRUI1N0UiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEE2RUNCNERGRjZGMTFFNkJBREVENEY1NTgyRUI1N0UiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7tAS7UAAAAMFBMVEUdNVRUhqiq5P4uYYiHjZlnps739/fH7f+5r7/U19mhfJ+HxOfnveLizN5nW3f///91VKnaAAAAEHRSTlP///////////////////8A4CNdGQAAAIxJREFUCNdj+A8FDP//ZwjatYEYP0V3CzPMBzImbirayMD5n+GbaHnRVgOGfIaf0kCGMcN8hi/SStobjQ38GT6KRm8NtpjwnuGjsaGgse8Vf4YfzMbGxj131jP8ZDA0tltzy43hv4NpoLHNKaCBKcyCxlyrgIxvzg8M+N6BLP3p+OoBH4jxPy0t58x/AB3GRopOIaOBAAAAAElFTkSuQmCC',
    favicon: 'https://www.freeimage.us/theme/default/images/favicon.ico'
  },
  {
    name: 'xxx-FreeImage',
    url: 'http://xxx.freeimage.us',
    faviconData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU0MjlGQjVCRkY2RDExRTZCNUU3QTEyMEMwOTIzMzE3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU0MjlGQjVDRkY2RDExRTZCNUU3QTEyMEMwOTIzMzE3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTQyOUZCNTlGRjZEMTFFNkI1RTdBMTIwQzA5MjMzMTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTQyOUZCNUFGRjZEMTFFNkI1RTdBMTIwQzA5MjMzMTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5t7b6jAAAAGFBMVEX////92VH21mv8863/8GX/vzn+zEDcqUI4rPovAAAAAXRSTlMAQObYZgAAAFtJREFUeNpsjkkOwDAIA8EE+/8/bkpWVZ0bFjA2KxywG0bnmhHxSUZwrqK9BLQCr6D53pAXtyVJgnuh/0t0lY4DgYalEcYL7rZgkZxeISeriJI16/QY2C+PAAMA12gB30O+mrsAAAAASUVORK5CYII=',
    favicon: 'https://xxx.freeimage.us/theme/default/images/favicon.ico'
  }
];

var stats = document.getElementById('major_stats');
var hostList = document.createElement('ul');
hostList.style.display = 'inline';
hostList.style.marginRight = '20px';

for (var host of hosts) {
  var li = document.createElement('li');
  var a = document.createElement('a');
  a.href = host.url;
  a.target = '_blank';
  a.title = host.name;
  var icon = new Image(15, 15);
  icon.src = host.faviconData;
  icon.id = host.name + '-icon';
  a.appendChild(icon);
//   a.innerHTML += host.name;
  a.style.paddingRight = '1px';
  a.style.paddingLeft = '1px';
  a.style.filter = 'grayscale(1)';
  a.addEventListener('mouseenter', function(e) {
    e.target.style.filter = 'grayscale(0)';
  }, false);
  a.addEventListener('mouseleave', function(e) {
    e.target.style.filter = 'grayscale(1)';
  }, false);
  li.style.fontSize = '12px';
  li.appendChild(a);
  hostList.appendChild(li);
  
  var backgroundIcon = new Image();
  backgroundIcon.dataset.host = host.name+'-icon';
  backgroundIcon.onload = function(){
    document.getElementById(this.dataset.host).src = this.src;
  }
  backgroundIcon.src = host.favicon;
}
var userInfo = document.getElementById('userinfo_invites');
stats.insertBefore(hostList, userInfo);
