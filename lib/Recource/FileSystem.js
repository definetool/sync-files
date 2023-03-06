const colors = require('colors');
const Patterns = require('@definejs/patterns');
const Directory = require('@definejs/directory');

const Timer = require('../Timer');


module.exports = exports = {

    scan(console, { dir, cache, patterns, }) {
        let timer = console ? new Timer(console) : null;
        let dirs = [];      //所有的子目录。
        let files = [];     //所有的文件。
        let caches = [];    //所有的缓存目录。
        let beginIndex = dir.length;


        if (timer) {
            timer.start(`${'开始扫描目录'.bold} ${dir.blue} >>`.bold);
        }


        Directory.each(dir, function (folder, myFiles) {
            let name = folder.slice(beginIndex);

            //是一个缓存目录。
            if (folder.endsWith(`/${cache}`)) {
                //父目录，即去掉 `.sync-files/` 后的目录。
                let pdir = folder.slice(0, 0 - cache.length);

                if (pdir != dir) {
                    caches.push(name);
                }
                return;
            }

            //当前目录不要加进去，只加子目录。
            if (folder != dir) {
                dirs.push(name); //取相对名称。
            }


            if (console) {
                let link = folder == dir ? `└──` : `├──`;
                let count = myFiles.length.toString();
                let sname = name || '/';
                console.log(`${link}找到 ${count.cyan} 个文件: ${sname.gray}`);
            }

            if (patterns && patterns.length > 0) {
                myFiles = Patterns.match(patterns, myFiles);

                myFiles = myFiles.map((file) => {
                    file = file.slice(beginIndex);
                    files.push(file);
                });
            }


        });


        dirs = dirs.sort();
        files = files.sort();
        caches = caches.sort();

        if (timer) {
            timer.stop(`<< 共找到 ${colors.cyan(caches.length)} 个缓存目录、${colors.cyan(dirs.length)} 个子目录、${colors.cyan(files.length)} 个文件，耗时{text}。`.bold);
        }

        return { dirs, files, caches, };
    },





};