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

const { app, BrowserWindow, ipcMain, dialog, screen, nativeTheme } = require('electron');
const path = require('path');
const fs = require('fs');
const { Marked } = require('marked');
const winston = require('winston');

const log = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'log.txt',
            level: 'info',
            format: winston.format.simple(),
        }),
    ],
});

let mainWindow;

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'marked_reader',
        icon: 'logo.png',
        minWidth: 400,
        minHeight: 200,
        resizable: true, // 允许用户调整窗口大小
        frame: false, // 移除默认的框架
        transparent: false, // 设置为透明
        backgroundColor: 'transparent', // 设置背景颜色为透明
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            backgroundColor: '#000000', // 设置网页背景颜色为黑色
        },
    });

    win.webContents.on('did-finish-load', () => {
        // 当网页加载完成后，设置网页的背景颜色
        win.webContents.send('change-bgcolor', 'black')
    })

    win.loadFile('index.html')

    const handle = ipcMain.on('message-from-renderer', (event, arg) => {
        if (arg.action === 'minimize') {
            win.minimize()
        } else if (arg.action === 'maximize') {
            console.log(win.isMaximized())
            if (win.isMaximized()) {
                win.restore()
            } else {
                win.maximize()
            }
        } else if (arg.action === 'close') {
            win.close()
        }
        event.reply('message-from-renderer', 'Response from main process')
    })

    win.on('closed', () => {
        mainWindow = null
        handle.removeAllListeners()
    })
};

app.whenReady().then(createWindow)

ipcMain.on('open-markdown-dialog', (event) => {
    const files = dialog.showOpenDialogSync(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Markdown Files', extensions: ['md', 'markdown'] },
        ],
    });

    if (files && files.length > 0) {
        event.reply('selected-markdown-file', files[0]);
    }
});

ipcMain.on('refresh-markdown', (event, filePath) => {
    // 请求主进程渲染 Markdown 文件

    if (filePath && filePath.length > 0) {
        event.reply('selected-markdown-file', filePath);
    }
});

ipcMain.on('render-markdown', (event, filePath) => {
    log.info('filePath');
    log.info(filePath);
    // 读取并渲染 Markdown 文件
    const markdownContent = fs.readFileSync(filePath, 'utf8');
    let markdownDir = path.dirname(filePath).replace(/\\/g, '/').replace(/%5C/g, '/'); // 获取 Markdown 文件的目录路径
    function walkTokens(token) {
        if (token.type === 'image' || token.type === 'link') {
            token.href = markdownDir + ("/" + token.href).replace("//", "/").replace("\\", "/").replace("%5C", "/").replace("./", "/"); // 修正相对路径
        }
    }
    const marked = new Marked();
    marked.use({ walkTokens });
    const htmlContent = marked.parse(markdownContent);
    event.reply('markdown-rendered', htmlContent);
});
