const colors = require('colors');
const fs = require('fs');
const Directory = require('@definejs/directory');
const Path = require('@definejs/path');
const File = require('@definejs/file');
const FileSystem = require('../../lib/FileSystem');
const ProgressBar = require('../../lib/ProgressBar');
const Timer = require('../../lib/Timer');


module.exports = exports = {

    //同步目录结构。
    syncDirs(meta) {
        let { source, target, console, stat, } = meta;
        let dir$name = {}; //同步后的 target 中对应于 source 的目录列表。
        let timer = new Timer(console);

        timer.start(`开始同步目录结构，共 ${colors.cyan(source.dirs.length)} 个>>`.bold);

        //先同步目录结构。
        source.dirs.forEach((dir) => {
            let name = Path.relative(source.dir, dir);
            let dir2 = Path.join(target.dir, name, '/');

            if (!fs.existsSync(dir2)) {
                console.log(`  创建目录:`, dir2);

                if (!meta.simulate) {
                    Directory.create(dir2);
                }
              
                stat.createDirs.push(dir2);
            }

           
            dir$name[dir2] = name;
            
        });

        timer.stop(`<< 目录结构同步完成，耗时{text}`.bold);


        return dir$name;

    },



    //同步文件列表。
    syncFiles(meta) {
        let { console, source, target, stat, } = meta;
        let { files, } = source;
        let file$md5 = {};
        let bar = new ProgressBar(files, console);
        let timer = new Timer(console);

        timer.start(`开始同步文件，共 ${colors.cyan(files.length)} 个 >>`.bold);

        //同步文件。
        files.forEach((file) => {
            let name = Path.relative(source.dir, file);     //相对于源目录的短名称。
            let file2 = Path.join(target.dir, name);          //要同步后的目标文件。
            let md5 = source.file$md5[file];                //
            let files = target.md5$files[md5];              //源文件对应的目标文件列表，可能为空。

            file$md5[file2] = md5;

            bar.render({ text: '同步文件: ', });

            //target 目录不存在对应于源文件的目标文件。
            if (!files || !files.length) {
                try {
                    bar.log(` `, `复制文件`.green, file.gray);

                    if (!meta.simulate) {
                        File.copy(file, file2);
                    }
                    
                    stat.successCopys.push(file);
                }
                catch (ex) {
                    bar.log(ex.message.bgRed);
                    stat.failCopys.push(file);
                }
                return;
            }

            //目标目录存在内容相同的文件，即 files 至少含有一项。
            //尝试找到文件名完全一样的。
            let index = files.findIndex((file) => {
                return file == file2;
            });

            //能找到文件名一样的文件。
            if (index >= 0) {
                files.splice(index, 1); //删除它，表示已处理。
                stat.jumpFiles.push(file);
                return;
            }


            //无法找到文件名一样的文件，但内容是一样的。
            let file1 = files[0];

            try {
                bar.log(``, `重命名文件`.yellow, file1.yellow);
                bar.log(`       `, `-->`, file2.underline);

                if (!meta.simulate) {
                    fs.renameSync(file1, file2);
                }

                files.splice(0, 1); //删除它，表示已处理。
                stat.successRenames.push(file1);
            }
            catch (ex) {
                bar.log(ex.message.bgRed);
                stat.failRenames.push(file1);
            }

        });

        timer.stop(`<< 文件同步完成，耗时{text}`.bold);

        return file$md5;
    },


    //清理。
    clear(meta, { dir$name, file$md5, }) {
        let { console, target, patterns, stat,} = meta;
        let { dirs, files, } = FileSystem.scan({ console, ...target, patterns, });
        let dirKeys = Object.keys(dir$name);    //需要保留的目录列表。
        let fileKeys = Object.keys(file$md5);   //需要保留的文件列表。
        let timer = new Timer(console);


        timer.start(`清理 target 目录 >>`.bold);

        //模仿同步的，要无条件地执行。

        //性能优化，先判断长度。
        //实际的目录数多于要保留的目录数，则执行删除。
        if (meta.simulate || dirs.length > dirKeys.length) {
            dirs.forEach((dir) => {
                let name = dir$name[dir];
                if (name) {
                    return;
                }


                if (!meta.simulate) {
                    Directory.delete(dir);
                }

                console.log(`  `, `删除目录`.bgMagenta, dir.magenta);
                stat.deleteDirs.push(dir);
            });
        }

        //性能优化，先判断长度。
        //实际的文件数多于要保留的文件数，则执行删除。
        if (meta.simulate || files.length > fileKeys.length) {
            files.forEach((file) => {
                let md5 = file$md5[file];

                if (md5) {
                    return;
                }

                if (!meta.simulate) {
                    File.delete(file);
                }
               
                console.log(`  `, `删除文件`.bgMagenta, file.magenta);
                stat.deleteFiles.push(file);
            });
        }

        timer.stop(`<< 清理 target 目录完成，耗时{text}。`.bold);


    },


};