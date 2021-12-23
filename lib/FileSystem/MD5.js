
const colors = require('colors');
const path = require('path');
const MD5 = require('@definejs/md5');
const $Array = require('@definejs/array');
const ProgressBar = require('../ProgressBar');
const Timer = require('../Timer');



module.exports = {

    parse({ console, files, file2$md5, cache, }) {
        let bar = new ProgressBar(files, console);
        let timer = new Timer(console);

        let file$md5 = {};
        let md5$files = {};
        let md5$main = {}; //一个 md5 对应多个文件时，找出一个主文件。 必须要有一个主文件，尽量找到不带 `(n)` 这种模式的文件名。

        timer.start(`开始计算 MD5，共 ${colors.cyan(files.length)} 个 >>`.bold);

        files.forEach((file, index) => {
            let md5 = file2$md5[file];

            if (!md5) {
                md5 = MD5.read(file);

                bar.render({
                    text: '计算 MD5: ',
                    msg: `  ${md5.cyan} ${file.grey}`,
                });
            }
            else {
                bar.render({ text: '计算 MD5: ', });
            }


            let main = md5$main[md5];
            let isCopy = file.includes('(') && file.includes(')'); //如 `IMG_9727 (1).JPG`。

            md5$main[md5] = !isCopy ? file : main || file;
            file$md5[file] = md5;
            $Array.add(md5$files, md5, file);
          
            cache.add(file, md5);
        });

        timer.stop(`<< 结束计算 MD5，耗时{text}。`.bold);

        let mains = Object.values(md5$main);

        return {
            file$md5,
            md5$files,
            md5$main,
            mains,
        };
    },


    sum({ dir, dirs, file$md5, }) {
        let files = Object.keys(file$md5);

        dirs = dirs.map((sdir) => {
            let name = path.relative(dir, sdir);
            return name;
        });

        files = files.map((file) => {
            let name = path.relative(dir, file);
            let md5 = file$md5[file];
            return `${name}:${md5}`;
        });

        dirs = dirs.sort().join('|');
        files = files.sort().join('|');

        dirs = MD5.get(dirs);
        files = MD5.get(files);

        let md5 = MD5.get(dirs + files);

        return md5;
    },


};