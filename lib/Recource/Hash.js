
const colors = require('colors');
const Hash = require('@definejs/md5');
const $Array = require('@definejs/array');

const ProgressBar = require('../ProgressBar');
const Timer = require('../Timer');
const Size = require('../Size');
const Main = require('./Hash/Main');


module.exports = {

    parse(console, { dir, cacher, files, text = '', }) {
        let file$hash = {};
        let hash$files = {};
        let hash$main = {};
        let main$files = {};    //主文件对应的 hash 相同的其它重复文件。
        let mains = [];         //所有的主文件。

        let bar = new ProgressBar(files, console);
        let timer = new Timer(console);
        let maxIndex = files.length - 1;
        

        timer.start(`开始计算哈希: ${dir.blue} 共 ${colors.cyan(maxIndex + 1)} 个 >>`.bold);


        files.forEach((file, index) => {
            let info = cacher.get(file);  //file 是相对于 dir 的短名称。
            let { hash, } = info;

            //已过期或不存在。
            if (!hash) {
                let size = Size.getDesc(info.size);
                let link = index == maxIndex ? `└──` : `├──`;

                hash = info.hash = Hash.read(`${dir}${file}`);
                cacher.add(file, info);

                bar.render({
                    text: `计算哈希(${text}): `,
                    msg: `${link.gray}${hash.cyan} ${file.grey} ${'|'.cyan} ${size.value.magenta}${size.desc}`,
                });
            }
            else {
                bar.render({ text: `计算哈希 ${text}: `, });
            }

            file$hash[file] = hash;
            $Array.add(hash$files, hash, file);
        });



        Object.entries(hash$files).forEach(([hash, files]) => {
            let main = hash$main[hash] = Main.get(files);

            //找出重复的文件。
            files = files.filter((file) => {
                return file != main;
            });

            main$files[main] = files.length == 0 ? undefined : files;
            mains.push(main);
        });




        timer.stop(`<< 结束计算哈希，耗时: {text}。`.bold);



        return {
            file$hash,
            hash$files,
            hash$main,
            main$files,
            mains,
        };
    },


    //对目录结构、文件列表、文件内容计算总的 hash
    //如果两个 hash 一样，则说明两个目录下的子目录结构、文件列表以及文件内容完全一致。
    sum({ dirs, files, file$hash, }) {
        dirs = dirs.sort();
        files = files.sort();

        files = files.map((file) => {
            let hash = file$hash[file];
            return `${file}:${hash}`;
        });

     
        dirs = Hash.get(dirs.join('|'));
        files = Hash.get(files.join('|'));

        let hash = Hash.get(dirs + files);
        hash = hash.toLowerCase();

        return hash;
    },


};