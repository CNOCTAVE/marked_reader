/* marked_reader is an open source markdown reader packed by electron
Copyright (C) 2024  Yu Hongbo, CNOCTAVE

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>. */

const { ipcRenderer } = require('electron');

function sendActionToMain(action) {
    const id = Date.now()
    ipcRenderer.send('message-from-renderer', { action, id })

    ipcRenderer.on('message-from-main', (event, arg) => {
        event.sender.removeListener('message-from-main', arguments[1])
    })
}

ipcRenderer.on('selected-markdown-file', (event, filePath) => {
    if (filePath) {
        // 记录 Markdown 路径
        document.getElementById('currentMarkdownFile').innerHTML = filePath;
        // 请求主进程渲染 Markdown 文件
        ipcRenderer.send('render-markdown', filePath);
    }
});

ipcRenderer.on('markdown-rendered', (event, htmlContent) => {
    // 显示渲染后的 Markdown 内容
    document.getElementById('markdownContent').innerHTML = htmlContent;
});
