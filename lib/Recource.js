
const Path = require('@definejs/path');

const Timer = require('../lib/Timer');

const Cache = require('./Recource/Cache');
const Hash = require('./Recource/Hash');
const FileSystem = require('./Recource/FileSystem');

module.exports = exports = {


    parse(console, { dir, cache, patterns, }, text) {
        //标准化是必要的，可以确保返回同样的结果。
        dir = Path.resolve(dir);
        dir = Path.normalizeDir(dir);
        cache = Path.normalizeDir(cache);


        let timer = new Timer(console);
        timer.start(`${'开始分析'.bold} ${dir.blue} >>`.bold);


        let { dirs, files, caches, } = FileSystem.scan(console, { dir, cache, patterns, });

        let cacher = new Cache(`${dir}/${cache}`, caches);
        cacher.parse();

        let { file$hash, hash$files, hash$main, main$files, mains, } = Hash.parse(console, { dir, cacher, files, text, });
        let sum = Hash.sum({ dirs, files, file$hash, });

        cacher.update(files);

        timer.stop(`<< ${'结束分析'.bold} ${dir.blue}，耗时: {text}。`.bold);

        return {
            sum,
            dir, cache, patterns,
            dirs, files, caches,
            file$hash, hash$files, hash$main, main$files, mains,
        };
    },


    getFiles({ dir, cache, patterns, }) {
        let { dirs, files, caches, } = FileSystem.scan(null, { dir, cache, patterns, });
        return files;
    },



};