// ==UserScript==
// @name         empornium better filelist
// @version      1
// @description  Shows filelist as expandable tree structure
// @author       ephraim
// @match        https://www.empornium.is/torrents.php?id=*
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
    var folderDetails = ce('div', 'folder_details folder_closed');
    folderDetails.innerHTML = `<span class="folder_name">${folder.name}</span><span class="folder_size">${formatBytes(folder.byteSize)}</span>`;
    folderElement.append(folderDetails);
    var container = ce('div', 'folder_container collapsable collapsed');
    folderDetails.addEventListener('click', toggleCollapsed);
    var folderList = ce('ul', 'folder_list');
    for (var f of folder.folders) {
        var foldi = ce('li', 'folder_item tree_item');
        foldi.appendChild(makeFolderDom(f));
        folderList.append(foldi);
    }
    container.append(folderList);

    var fileList = ce('ul', 'file_list');
    for (var file of folder.files) {
        var filei = ce('li', 'file_item tree_item');
        filei.innerHTML = `<div class="icon_stack"><i class="font_icon file_icons ${getFileType(file.name)}"></i></div><span class="file_name">${file.name}</span><span class="file_size">${file.size}</span>`;
        fileList.append(filei);
    }
    container.append(fileList);
    folderElement.append(container);
    return folderElement;
}


function toggleCollapsed(e) {
    e.currentTarget.nextElementSibling.classList.toggle('collapsed');
    e.currentTarget.classList.toggle('folder_open');
    e.currentTarget.classList.toggle('folder_closed');
}


function list2Tree() {
    var tabl = fileList.querySelector('table');
    var rows = [...tabl.rows];

    var root = {};
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
    var treeContainer = ce('div', 'tree_container');
    treeContainer.append(makeFolderDom(root));
    treeContainer.querySelector('.collapsed').classList.toggle('collapsed');
    fileList.append(treeContainer);
    fileList.classList.remove('hidden');
}


var fileList = document.querySelector('div[id^="files_"]');
var fileListToggle = document.querySelector('a[onclick^="show_files"]');
fileListToggle.text = '(Show file tree)';
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
.file_list {
    padding-left: 0.5em;
}
.folder li {
    list-style-type: none;
}

.file_item:nth-child(odd) {
    background-color: #EFF3F6;
}
.collapsed {
    display: none;
}
.folder_details  {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #FCFCFC;
    color: #333333;
    padding: 2px 0 2px 5px;
    margin-left: 0.5em;
    cursor: pointer;
}
.folder_open:before {
    content: '📂';
}
.folder_closed:before {
    content: '📁';
}
.folder_details:before {
    margin-right: 0.3em;
  }
.folder_item:nth-child(odd) .folder_details {
    background-color: #EFF3F6;
}
.folder_name {
    flex: 1;
}
.folder_size {
    padding-right: 1em;
    font-size: 9pt;
}
.file_item {
    background-color: #FCFCFC;
    display: flex;
    align-items: center;
    font-size: 8pt;
    padding: 3px;
}
.file_name {
    flex: 1;
    margin-left: 0.5em;
}
.file_size {
    padding-right: 1em;
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