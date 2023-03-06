const colors = require('colors');
const fs = require('fs');
const Directory = require('@definejs/directory');
const File = require('@definejs/file');

const ProgressBar = require('../../lib/ProgressBar');
const Timer = require('../../lib/Timer');
const Size = require('../../lib/Size');


module.exports = {

    //删除文件。
    deleteFiles(console, { target, compare, output, }) {
        let { deletes, } = compare.files;
        let total = deletes.length;

        if (total == 0) {
            return;
        }

        let maxIndex = total - 1;
        let timer = new Timer(console);
        let bar = new ProgressBar(total, console);
        let bakDir = output.dir && output.deletes ? `${output.dir}${output.deletes}` : '';

        timer.start(`开始清理文件 ${target.dir.blue}，共 ${colors.cyan(total)} 个 >>`.bold);


        deletes.forEach((name, index) => {
            let file = `${target.dir}${name}`;
            let link = index == maxIndex ? `└──` : `├──`;

            bar.render({
                text: '清理文件: ',
                msg: `${link.gray}删除文件: ${name.cyan}`,
            });

            //备份一下。
            File.copy(file, `${bakDir}${name}`);
            fs.unlinkSync(file);
        });

        timer.stop(`<< 结束清理文件 ${target.dir.blue}，耗时{text}`.bold);

    },

    //同步目录结构。
    createDirs(console, { target, compare, }) {
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

    //移动冲突文件。
    randomFiles(console, { target, compare, }) {
        let { file$random, } = compare.files;

        let randoms = Object.entries(file$random).map(([src, dest]) => {
            return { src, dest, };
        });

        let total = randoms.length;

        if (total == 0) {
            return;
        }

        let maxIndex = total - 1;
        let timer = new Timer(console);
        let bar = new ProgressBar(total, console);

        timer.start(`开始移动冲突文件 ${target.dir.blue}，共 ${colors.cyan(total)} 个 >>`.bold);

        //重命名文件。
        randoms.forEach(({ src, dest, }, index) => {
            let srcFile = `${target.dir}${src}`;
            let destFile = `${target.dir}${dest}`;
            let link = index == maxIndex ? `└──` : `├──`;

            bar.render({
                text: '移动文件: ',
                msg: `${link.gray}重命名文件: ${src.cyan} \n        -->  ${dest.green}`,
            });

            //为发现程序逻辑中的错误，理论上是没有才是正常的。
            if (fs.existsSync(destFile)) {
                bar.log('\n', destFile);
                throw new Error(`已存在目标文件: ${destFile}`);
            }

            fs.renameSync(srcFile, destFile);

        });


     

        timer.stop(`<< 结束移动冲突文件，耗时{text}`.bold);


    },

    //移动文件。
    renameFiles(console, { target, compare, }) { 
        let { renames, file$random,  } = compare.files;
        let total = renames.length;

        if (total == 0) {
            return;
        }

        let maxIndex = total - 1;
        let timer = new Timer(console);
        let bar = new ProgressBar(total, console);

        timer.start(`开始移动文件 ${target.dir.blue}，共 ${colors.cyan(total)} 个 >>`.bold);


        //重命名文件。
        renames.forEach(({ src, dest, }, index) => {
            //先检查是否已被改成了随机名。
            src = file$random[src] || src;

            let srcFile = `${target.dir}${src}`;
            let destFile = `${target.dir}${dest}`;
            let link = index == maxIndex ? `└──` : `├──`;

            bar.render({
                text: '移动文件: ',
                msg: `${link.gray}重命名文件: ${src.cyan} \n        -->  ${dest.green}`,
            });

            //为发现程序逻辑中的错误，理论上是没有才是正常的。
            if (fs.existsSync(destFile)) {
                bar.log('\n', destFile.bgRed);
                throw new Error(`已存在目标文件: ${destFile}`);
            }

            fs.renameSync(srcFile, destFile);

        });

        timer.stop(`<< 结束移动文件，耗时{text}`.bold);
    },

    //复制文件。
    copyFiles(console, { source, target, compare, }) {
        let { creates, } = compare.files;
        let total = creates.length;

        if (total == 0) {
            return;
        }

        let maxIndex = total - 1;
        let timer = new Timer(console);
        let bar = new ProgressBar(total, console);

        timer.start(`开始复制文件，共 ${colors.cyan(total)} 个 >>`.bold);

        //复制文件。
        creates.forEach((name, index) => {
            let src = `${source.dir}${name}`;
            let dest = `${target.dir}${name}`;
            let stat = fs.statSync(src);
            let size = Size.getDesc(stat.size);
            let link = index == maxIndex ? `└──` : `├──`;

            bar.render({
                text: '复制文件: ',
                msg: `${link.gray}复制文件: ${name.cyan} | ${size.value.magenta}${size.desc.grey}`,
            });

            //为发现程序逻辑中的错误，理论上是没有才是正常的。
            if (fs.existsSync(dest)) {
                bar.log('\n', dest.bgRed);
                throw new Error(`已存在目标文件: ${dest}`);
            }

            fs.copyFileSync(src, dest);
        });

    },

    //删除目录。
    deleteDirs(console, { target, compare, output, getFiles, }) {
        let { deletes, } = compare.dirs;
        let total = deletes.length;

        if (total == 0) {
            return;
        }

        let maxIndex = total - 1;
        let timer = new Timer(console);
        let bar = new ProgressBar(total, console);
        let bakDir = output.dir && output.deletes ? `${output.dir}${output.deletes}` : '';


        timer.start(`开始清理目录 ${target.dir.blue}，共 ${colors.cyan(total)} 个 >>`.bold);

        deletes.forEach((name, index) => {
            let dir = `${target.dir}${name}`;
            let link = index == maxIndex ? `└──` : `├──`;

            bar.render({
                text: '清理目录: ',
                msg: `${link.gray}删除目录: ${name.cyan}`,
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