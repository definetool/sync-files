
const FileSystem = require('../lib/FileSystem');
const Timer = require('../lib/Timer');

const Console = require('./Task/Console');
const Cache = require('./Task/Cache');
const Home = require('./Task/Home');
const Report = require('./Task/Report');
const Target = require('./Task/Target');
const Meta = require('./Task/Meta');



let mapper = new Map();

class Task {
    /**
    * 构造器。
    * @param {*} config 配置对象。
    *   config = {
    *       home: '',       //会话过程中产生的日志等临时文件的存放目录。 建议每次都使用一个不同的目录，以方便多次运行后进行查找。
    *       console: '',    //会话过程中产生的日志的文件名称。 如果指定，则写入此文件；否则仅在控制台输出。
    *       cache: '',      //解析 source 目录和 target 目录中的文件 MD5 时要保存的元数据信息的目录名，建议指定为 `.sync-files/`。
    *       source: '',     //要同步的源目录。
    *       target: '',     //要同步的目标目录。
    *       patterns: [],   //要同步的文件列表模式。 如果不指定，或指定为空数组，则表示全部文件。
    *   };
    */
    constructor(config) {
        config = Object.assign({}, exports.defautls, config);



        let console = Console.create(config);
        let timer = new Timer(console);

        let meta = Meta.create(config, {
            console,
            timer,
        });

        let { source, target, } = meta;

        if (source) {
            source.cache = new Cache(source.dir, config.cache);
        }

        if (target) {
            target.cache = new Cache(target.dir, config.cache);
        }


        mapper.set(this, meta);
    }

    /**
    * 解析。
    * 提取文件的 MD5 信息，保存到 cache 目录中。
    */
    parse() {
        let meta = mapper.get(this);
        let { console, timer, source, target, patterns, } = meta;



        timer.start();

        //返回: { sum, dirs, files, file$md5, md5$main, md5$files, isEmpty, };
        if (source) {
            source = FileSystem.parse({ console, ...source, patterns, });
        }

        if (target) {
            target = FileSystem.parse({ console, ...target, patterns, });
        }


        Object.assign(meta.source, source);
        Object.assign(meta.target, target);

        Home.write(meta, 'source.json', source);
        Home.write(meta, 'target.json', target);

    }

    /**
    * 同步。
    */
    sync() {
        let meta = mapper.get(this);
        let { source, target, console, } = meta;


        if (!source) {
            console.log(`source 目录不能为空。`.bgRed);
            return;
        }

        if (!target) {
            console.log(`target 目录不能为空。`.bgRed);
            return;
        }

        if (source.dir == target.dir) {
            console.log(`source 目录不能与 target 目录相同。`.bgRed);
            return;
        }

        if (!source.sum) {
            console.log(`source 目录尚未进行解析。`.bgRed);
            return;
        }

        if (!target.sum) {
            console.log(`target 目录尚未进行解析。`.bgRed);
            return;
        }

        if (source.sum == target.sum) {
            Report.render(meta);
            console.log(`source 目录与 target 目录完全一致，无需同步。`.green.bold);
            return;
        }


        let dir$name = Target.syncDirs(meta);               //先同步目录结构。
        let file$md5 = Target.syncFiles(meta);   //再同步文件。

        meta.sync = { dir$name, file$md5, };
        target.cache.write(file$md5);
        Home.write(meta, 'stat.json', meta.stat);
    }

    /**
    * 清理。
    */
    clear() {
        let meta = mapper.get(this);
        let { sync, target, } = meta;

        if (!sync || target.isEmpty) {
            return;
        }

        //第一轮同步后，目标目录已包含了源目录的全部文件和目录。
        //但目标目录可能还存在一些相对于源目录来说是多余的文件和目录。
        Target.clear(meta, sync);

        Home.write(meta, 'stat.json', meta.stat);
    }

    /**
    * 校验。
    */
    verify() {
        let meta = mapper.get(this);

        if (!meta.sync) {
            return;
        }


        let { console, source, target, patterns, } = meta;

        if (!target.isEmpty) {
            //为了确保最终结果一致，最后再做一次检验是最安全的，可以避免代码逻辑有漏洞。
            console.log(`校验目标目录 >>`.bold);
            target = meta.target = FileSystem.parse({ console, ...target, patterns, });
        }
        else { //target 目录为空，则是直接使用 source 的信息来显示。
            meta.target = source;
        }

        Report.render(meta);

        if (!target.isEmpty && source.sum != target.sum) {
            console.log(`!!!!!!!!!!!!! 同步后的结果不一致 !!!!!!!!!!!!!!!!!!`.bgRed);
            return;
        }


        let hasError = Report.stat(meta);

        if (hasError) {
            console.log(`同步完成，但存在失败。`.red);
        }
        else {
            console.log(`======================== 同步成功 ========================`.bgGreen);
        }

    }

}

module.exports = exports = Task;
exports.defautls = require('./Task.defaults');