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

module.exports = {
    targets: [
        {
            target: 'AppStore',
            arch: ['x64'],
            platform: 'mac'
        },
        {
            target: 'Windows',
            arch: ['ia32', 'x64']
        }
    ],
    config: {
        "appId": "cn.cnoctave.marked_reader",
        "productName": "marked_reader",
        "buildNumber": "1.0.0",
        directories: {
            output: 'dist',
        },
        win: {
            icon: 'logo.png',
        },
        mac: {
            icon: 'logo.png',
        },
        linux: {
            icon: 'logo.png',
        },
    },
    build: {
        // 在这里，你可以添加其他的配置选项
    },
};