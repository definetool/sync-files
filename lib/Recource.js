
const Timer = require('../lib/Timer');

const Cache = require('./Recource/Cache');
const Hash = require('./Recource/Hash');
const FileSystem = require('./Recource/FileSystem');

module.exports = exports = {


    parse(console, { dir, cache, patterns, }) {
        let timer = new Timer(console);
        timer.start(`${'开始分析'.bold} ${dir.blue} >>`.bold);


        let { dirs, files, caches, } = FileSystem.scan(console, { dir, cache, patterns, });

        let cacher = new Cache(`${dir}/${cache}`, caches);
        cacher.parse();

        let { file$hash, hash$files, hash$main, main$files, mains, } = Hash.parse(console, { dir, cacher, files, });
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



};