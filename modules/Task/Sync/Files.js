const colors = require('colors');
const fs = require('fs');
const File = require('@definejs/file');


const ProgressBar = require('../../../lib/ProgressBar');
const Timer = require('../../../lib/Timer');
const Size = require('../../../lib/Size');


module.exports = {

    //删除文件。
    delete(console, { target, compare, output, }) {
        let { deletes, } = compare.files;
        let total = deletes.length;

        if (total == 0) {
            return;
        }

        let maxIndex = total - 1;
        let timer = new Timer(console);
        let bar = new ProgressBar(total, console);
        let bakDir = output.dir && output.deletes ? `${output.dir}${output.deletes}files/` : '';

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

    //移动冲突文件。
    random(console, { target, compare, }) {
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
    rename(console, { target, compare, }) { 
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
    copy(console, { source, target, compare, }) {
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

  
    

};