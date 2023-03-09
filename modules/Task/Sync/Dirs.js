const colors = require('colors');
const fs = require('fs');
const Directory = require('@definejs/directory');

const ProgressBar = require('../../../lib/ProgressBar');
const Timer = require('../../../lib/Timer');


module.exports = {
 

    //同步目录结构。
    create(console, { target, compare, }) {
        let { creates, } = compare.dirs;
        let total = creates.length;

        if (total == 0) {
            return;
        }

        let maxIndex = total - 1;
        let timer = new Timer(console);
        let bar = new ProgressBar(total, console);

        timer.start(`开始同步目录结构 ${target.dir.blue}，共 ${colors.cyan(total)} 个>>`.bold);


        creates.forEach((name, index) => {
            let dest = `${target.dir}${name}`;
            let link = index == maxIndex ? `└──` : `├──`;

            bar.render({
                text: '同步目录: ',
                msg: `${link.gray}创建目录: ${name.cyan}`,
            });

            //为发现程序逻辑中的错误，理论上是没有才是正常的。
            if (fs.existsSync(dest)) {
                bar.log('\n', dest.bgRed);
                throw new Error(`已存在目标目录: ${dest}`);
            }

            Directory.create(dest);
        });

        timer.stop(`<< 结束同步目录结构，耗时{text}`.bold);

    },


    //删除目录。
    delete(console, { target, compare, output, getFiles, }) {
        let { deletes, } = compare.dirs;
        let total = deletes.length;

        if (total == 0) {
            return;
        }

        let maxIndex = total - 1;
        let timer = new Timer(console);
        let bar = new ProgressBar(total, console);
        let bakDir = output.dir && output.deletes ? `${output.dir}/${output.deletes}/dirs/` : '';


        timer.start(`开始清理目录 ${target.dir.blue}，共 ${colors.cyan(total)} 个 >>`.bold);

        deletes.forEach((name, index) => {
            let dir = `${target.dir}${name}`;
            let link = index == maxIndex ? `└──` : `├──`;
            let act = bakDir ? '备份&删除' : '直接删除';

            bar.render({
                text: '清理目录: ',
                msg: `${link.gray}${act}目录: ${name.cyan}`,
            });

            //可能在删除它的父目录时连同它自己一起被删除了。
            if (fs.existsSync(dir)) {

                //为发现程序逻辑中的错误，理论上是没有才是正常的。
                //为了检查上一步的清理文件是否已删除干净。
                let files = getFiles(dir);

                if (files.length > 0) {
                    console.log(files);
                    bar.log('\n', dir.bgRed);
                    throw new Error(`无法删除目标目录 ${dir}，因为存在文件。`);
                }

                Directory.copy(dir, `${bakDir}${name}`);
            }

            Directory.delete(dir);
        });

        timer.stop(`<< 结束清理目录 ${target.dir.blue}，耗时{text}`.bold);

    },
    

};