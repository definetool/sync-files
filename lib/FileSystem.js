const colors = require('colors');

const Directory = require('@definejs/directory');
const Path = require('@definejs/path');
const Timer = require('./Timer');
const MD5 = require('./FileSystem/MD5');

module.exports = exports = {

    scan({ console, dir, cache, }) {
        dir = Path.normalizeDir(dir);

        let dirs = [];
        let files = [];
        let timer = new Timer(console);

        timer.start(`${'开始扫描目录'.bold} ${dir.blue} >>`.bold);


        Directory.each(dir, function (folder, list) {
            if (cache.is(folder)) {
                return;
            }

            console.log(`  找到 ${colors.cyan(list.length)} 个文件: ${folder.gray}`);

            dirs.push(folder);
            files.push(...list);
        });

        timer.stop(`<< 共找到 ${colors.cyan(dirs.length)} 个子目录、${colors.cyan(files.length)} 个文件，耗时{text}。`.bold);

        return { dirs, files, };
    },


    parse({ console, dir, cache, }) {
        let { dirs, files, } = exports.scan({ console, dir, cache, });
        let file2$md5 = cache.read();

        let { file$md5, md5$main, md5$files, } = MD5.parse({
            console,
            files,
            file2$md5,
            cache,
        });

        let sum = MD5.sum({ dir, dirs, file$md5, });
        let isEmpty = dirs.length + files.length == 0;
        
        cache.write(file$md5);

        return { sum, dirs, files, file$md5, md5$main, md5$files, isEmpty, };
    },



};