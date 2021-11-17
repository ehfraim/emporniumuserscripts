// ==UserScript==
// @name         empornium better filelist
// @version      2.1
// @description  Shows filelist as expandable tree structure
// @author       ephraim
// @namespace    empornium
// @match        https://www.empornium.is/torrents.php?id=*
// @match        https://www.empornium.me/torrents.php?id=*
// @match        https://www.empornium.sx/torrents.php?id=*
// @grant        none
// ==/UserScript==


function tree(folder) {
    var folders = [];
    var files = [];
    folder.files.forEach(f => {
        if (/\//.test(f.name)) {
            var levels = f.name.split('/');
            var currentLevel = levels.shift();
            f.name = levels.join('/');
            var existing = folders.find(fold => {
                return fold.name == currentLevel;
            });
            if (existing) {
                existing.files.push(f);
            } else {
                var newFolder = {};
                newFolder.name = currentLevel;
                newFolder.files = [f];
                folders.push(newFolder);
            }
        } else {
            files.push(f);
        }
    });
    folder.folders = folders;
    folder.files = files;
    folders.forEach(tree);
    folder.byteSize = folderSize(folder);
    return folder;
}


function folderSize(folder) {
    var fileSize = folder.files.reduce((currentSize, file) => {
        return currentSize + file.byteSize;
    }, 0);
    if (folder.folders.length) {
        return fileSize + folder.folders.reduce((currentSize, folder) => {
            return currentSize + folderSize(folder);
        }, 0);
    } else {
        return fileSize;
    }
}


function sizeInBytes(ssize) {
    ssize = ssize.replace(',', '');
    var number, unit;
    [number, unit] = ssize.split(' ');
    number = +number;
    var suffixes = {
        KiB: 1024,
        MiB: 1024 * 1024,
        GiB: 1024 * 1024 * 1024,
        TiB: 1024 * 1024 * 1024 * 1024
    };
    return number * suffixes[unit] || number;
}


function formatBytes(bytes) {
    if (bytes == 0) return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


function ce(type, className) {
    var e = document.createElement(type);
    e.className = className || '';
    return e;
}


function getFileType(fileName) {
    var type;
    type = fileName.match(/\.(jpg|jpeg|png|gif|bmp)$/i);
    if (type) return `icon_files_image file_type_${type[1]}`;
    type = fileName.match(/\.(mp4|avi|m4v|mpg|mpeg|mkv|mov|wmv|flv)$/i);
    if (type) return `icon_files_video file_type_${type[1]}`;
    type = fileName.match(/\.(txt|srt)$/i);
    if (type) return `icon_files_text file_type_${type[1]}`;
    type = fileName.match(/\.(zip|rar)$/i);
    if (type) return `icon_files_compressed file_type_${type[1]}`;
    type = fileName.match(/\.(iso|vob)$/i);
    if (type) return `icon_files_disc file_type_${type[1]}`;
    type = fileName.match(/\.(mp3|wav|flac|m4a|wma|aac)$/i);
    if (type) return `icon_files_audio file_type_${type[1]}`;
    type = fileName.match(/\.(exe|apk)$/i);
    if (type) return `icon_files_executable file_type_${type[1]}`;

    return 'icon_files_unknown';
}


function makeFolderDom(folder) {
    var folderElement = ce('div', 'folder');
    var folderDetails = ce('div', 'folder_details folder_closed tree_item');
    folderDetails.innerHTML = `<span class="folder_name">${folder.name}</span><span class="folder_size">${formatBytes(folder.byteSize)}</span>`;
    folderElement.append(folderDetails);
    var container = ce('div', 'folder_container');
    folderDetails.addEventListener('click', toggleCollapsed);
    if (folder.folders.length) {
        var folderList = ce('ul', 'folder_list');
        for (var f of folder.folders) {
            var foldi = ce('li', 'folder_item');
            foldi.appendChild(makeFolderDom(f));
            folderList.append(foldi);
        }
        container.append(folderList);
    }
    if (folder.files.length) {
        var fileList = ce('ul', 'file_list');
        for (var file of folder.files) {
            var filei = ce('li', 'file_item tree_item');
            filei.innerHTML = `<div class="icon_stack"><i class="font_icon file_icons ${getFileType(file.name)}"></i></div><span class="file_name">${file.name}</span><span class="file_size">${file.size}</span>`;
            fileList.append(filei);
        }
        container.append(fileList);
    }
    folderElement.append(container);
    return folderElement;
}


function toggleCollapsed(e) {
    this.classList.toggle('folder_open');
    this.classList.toggle('folder_closed');
}


function createTree() {
    var treeContainer = ce('div', 'tree_container');
    treeContainer.append(makeFolderDom(root));
    var firstFolder = treeContainer.querySelector('.folder_closed');
    firstFolder.classList.remove('folder_closed');
    firstFolder.classList.add('folder_open');

    return treeContainer;
}


function filterList(e) {
    var container = document.querySelector('.tree_container');
    container.classList.add('hidden'); // temporary hide  when hiding children
    if ((e.key === "Escape")||((e.key === "Backspace" || e.key === "Delete") && this.value.length < 1)) {
        this.value = '';
        container.querySelectorAll('.hidden, .folder_force_open, .file_found').forEach(f => {
            f.classList.remove('hidden', 'folder_force_open', 'file_found');
        });
        container.classList.remove('hidden');
        return false;
    }

    var needle = new RegExp(this.value, 'i');
    container.querySelectorAll('.file_name').forEach(f => {
        var hit = f.innerText.match(needle);
        var fileItem = f.parentElement;
        if (hit) {
            fileItem.classList.remove('hidden');
            fileItem.classList.add('file_found');
        } else {
            fileItem.classList.add('hidden');
            fileItem.classList.remove('file_found');
        }
    });
    container.querySelectorAll('.folder').forEach(f => {
        if (f.querySelector('.file_found')) {
            f.querySelector('.folder_details').classList.add('folder_force_open');
        } else {
            f.querySelector('.folder_details').classList.remove('folder_force_open');
        }
    });
    container.classList.remove('hidden');
}

function expandAllFolders(e) {
    e.preventDefault();
    var closedFolders = document.querySelectorAll('.folder_closed');
    var openFolders = [...document.querySelectorAll('.folder_open')].slice(1);
    if (this.dataset.collapsed == 'collapsed') {
        closedFolders.forEach(f => {
            f.classList.add('folder_open');
            f.classList.remove('folder_closed');
        });
        this.dataset.collapsed = 'expanded';
        this.innerText = this.innerText.replace('📁Expand', '📂Collapse');
    } else if (this.dataset.collapsed == 'expanded') {
        openFolders.forEach(f => {
            f.classList.add('folder_closed');
            f.classList.remove('folder_open');
        });
        this.dataset.collapsed = 'collapsed';
        this.innerText = this.innerText.replace('📂Collapse', '📁Expand');
    }
}

function list2Tree() {
    var tabl = fileList.querySelector('table');
    var rows = [...tabl.rows];

    root.name = rows[0].innerText.trim();
    root.files = rows.slice(2).map(r => {
        var tdata = r.querySelectorAll('td');
        return {
            name: tdata[0].innerText.trim(),
            size: tdata[1].innerText.trim(),
            byteSize: sizeInBytes(tdata[1].innerText.trim())
        };
    });

    root = tree(root);
    tabl.style.display = 'none';
    var header = ce('div', 'tree_header colhead');
    var headerName = ce('span', 'header_name sort_ascending');
    headerName.innerText = 'Name';
    headerName.addEventListener('click', sortTree);
    var headerSize = ce('span', 'header_size');
    headerSize.innerText = 'Size';
    headerSize.addEventListener('click', sortTree);
    headerName.dataset.other = 'header_size';
    headerSize.dataset.other = 'header_name';
    var tools = ce('span', 'header_tools');
    var expand = ce('a', 'header_expand');
    var filterInput = ce('input', 'header_filter');
    expand.text = '(📁Expand all)';
    expand.href = '#';
    expand.title = 'Expand all folders';
    expand.dataset.collapsed = 'collapsed';
    filterInput.placeholder = '🔍Filter list';
    filterInput.type = 'search';
    filterInput.addEventListener('input', filterList);
    expand.addEventListener('click', expandAllFolders);
    tools.append(expand, filterInput);
    header.append(headerName, tools, headerSize);
    fileList.append(header);

    var treeContainer = createTree();
    fileList.append(treeContainer);
    fileList.classList.remove('hidden');
}

function sortFolderSize(folder, ascending) {
    var direction = ascending ? 1 : -1;
    folder.files.sort((a, b) => {
        return direction * (b.byteSize - a.byteSize);
    });
    folder.folders.sort((a, b) => {
        return direction * (b.byteSize - a.byteSize);
    });
    folder.folders.forEach(f => {
        sortFolderSize(f, ascending);
    });
}


function sortFolderName(folder, ascending) {
    var direction = ascending ? -1 : 1;
    folder.files.sort((a, b) => {
        return direction * (a.name.localeCompare(b.name));
    });
    folder.folders.sort((a, b) => {
        return direction * (a.name.localeCompare(b.name));
    });
    folder.folders.forEach(f => {
        sortFolderName(f, ascending);
    });
}


function sortTree() {
    var ascending = this.classList.contains('sort_ascending');
    if (ascending) {
        this.classList.add('sort_descending');
        this.classList.remove('sort_ascending');
    } else {
        this.classList.add('sort_ascending');
        this.classList.remove('sort_descending');
    }
    var other = this.parentElement.querySelector(`.${this.dataset.other}`);
    other.classList.remove('sort_ascending');
    other.classList.remove('sort_descending');

    document.querySelector('.tree_container').remove();

    if (this.classList.contains('header_name')) {
        sortFolderName(root, ascending);
    } else {
        sortFolderSize(root, ascending);
    }

    var treeContainer = createTree();
    fileList.append(treeContainer);
}


var fileList = document.querySelector('div[id^="files_"]');
var fileListToggle = document.querySelector('a[onclick^="show_files"]');
fileListToggle.text = '(Show file tree)';
var root = {};
fileListToggle.onclick = function toggleTree() {
    if (this.classList.contains('open_tree')) {
        this.text = '(Show file tree)';
    } else {
        this.text = '(Hide file tree)';
    }
    this.classList.toggle('open_tree');
    fileList.classList.toggle('hidden');
    if (!document.querySelector('.tree_container')) {
        list2Tree();
    }
    return false;
};

var oldListItemOdd = fileList.querySelector('.rowa');
var oldStyleOdd = getComputedStyle(oldListItemOdd);
var treeStyle = ce('style');
document.head.append(treeStyle);
document.head.append(treeStyle);
treeStyle.innerHTML = `
.tree_container * {
    margin: 0;
}
.folder_container {
    margin-left: 1.5em;
    border-left: dashed thin #8FC5E0;
}
.tree_header {
    display: flex;
    padding: 0.5em 2em 0.3em 2em;
    justify-content: space-between;
    align-items: baseline;
}
.sort_ascending:after {
    content: '🡩';
    margin-left: 0.3em;
    font-size: 10pt;
}
.sort_descending:after {
    content: '🡫';
    margin-left: 0.3em;
    font-size: 10pt;
}
.header_name {
    cursor: pointer;
}
.header_size {
    cursor: pointer;
}
.header_tools {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    width: 400px;
}
.header_expand {
    margin-right: 1em;
    font-weight: normal;
    font-size: 10pt;
}
.header_filter {
    border: none;
    border-radius: 5px;
    background: #29374F;
    color: #bcd;
    width: 20em;
    padding: 4px;
}
.file_list {
    padding-left: 0.5em;
}
.folder_list {
    margin-bottom: 10px;
}
.folder li {
    list-style-type: none;
}
.file_item:nth-child(odd) {
    background-color: ${oldStyleOdd.backgroundColor};
}
.folder_details  {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 2px 0 2px 5px;
    margin-left: 0.5em;
    cursor: pointer;
}
.folder_open:before {
    content: '◢​📂';
    font-size: 12pt;
}
.folder_closed:before {
    content: '▷​📁';
    font-size: 12pt;
}
.folder_closed + div {
    display: none;
}
.folder_force_open + div {
    display:block;
}
.folder_details:before {
    margin-right: 0.3em;
  }
.folder_item:nth-child(odd) .folder_details {
    background-color: ${oldStyleOdd.backgroundColor};
}
.folder_name {
    flex: 1;
}
.folder_size {
    padding-right: 1em;
    font-size: 9pt;
}
.file_item {
    display: flex;
    align-items: center;
    font-size: 8pt;
    padding: 3px;
    cursor: default;
}
.file_name {
    flex: 1;
    margin-left: 0.5em;
}
.file_size {
    padding-right: 1em;
}
.tree_item:hover {
    transform: scale(1.002);
    box-shadow: 2px 1px 8px #0006;
}
.file_item .font_icon {
    font-size: 10pt;
}
.file_item .icon_files_compressed {
    color:#F5C438;
    -webkit-text-stroke: 0.5px black;
}
.file_item .icon_files_executable {
    color:#f318bc;
}
.file_type_jpg, .file_type_jpeg {
    color:#a88526;
}
.file_type_mp4, .file_type_m4v {
    color:#7406a1;
}
.file_type_avi, .file_type_gif {
    color:#026102;
}
.file_type_mpg, .file_type_mpeg, .file_type_png {
    color:#740000;
}
.file_type_mkv, .file_type_mov, .file_type_bmp {
    color:#003cac;
}
.file_type_wmv {
    color:#694d00;
}
`;